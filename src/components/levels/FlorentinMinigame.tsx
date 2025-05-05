import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../lib/gameStore';

type FlorentinMinigameProps = {
  onWin: () => void;
  onLose: () => void;
};

const GAME_WIDTH = 480;
const GAME_HEIGHT = 640;
const PLAYER_RADIUS = 24;
const DROP_RADIUS = 16;
const DROP_SPEED = 3;
const DROP_INTERVAL = 900;
const GAME_DURATION = 20000; // 20 seconds

function randomX() {
  return Math.random() * (GAME_WIDTH - 2 * DROP_RADIUS) + DROP_RADIUS;
}

export default function FlorentinMinigame({ onWin, onLose }: FlorentinMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2);
  const [drops, setDrops] = useState<{ x: number; y: number }[]>([]);
  const [collectible, setCollectible] = useState<{
    x: number;
    y: number;
    type: 'hummus' | 'falafel';
  } | null>(null);
  const [running, setRunning] = useState(true);
  const [lifeLost, setLifeLost] = useState(false);
  const animationRef = useRef<number>();
  const startTime = useRef<number>(Date.now());

  const loseHeart = useGameStore((s) => s.loseHeart);
  const gainHeart = useGameStore((s) => s.gainHeart);
  const hearts = useGameStore((s) => s.hearts);
  const setGameState = useGameStore((s) => s.setGameState);

  // Handle mouse movement
  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      setPlayerX(Math.max(PLAYER_RADIUS, Math.min(GAME_WIDTH - PLAYER_RADIUS, x)));
    }
    const canvas = canvasRef.current;
    canvas?.addEventListener('mousemove', handleMouse);
    return () => canvas?.removeEventListener('mousemove', handleMouse);
  }, []);

  // Drop spawner
  useEffect(() => {
    if (!running) return;
    let timeoutId: NodeJS.Timeout;
    function spawnDrop() {
      setDrops((d) => [...d, { x: randomX(), y: -DROP_RADIUS }]);
      timeoutId = setTimeout(spawnDrop, DROP_INTERVAL);
    }
    spawnDrop();
    return () => clearTimeout(timeoutId);
  }, [running]);

  // Occasionally spawn a collectible
  useEffect(() => {
    if (!running || collectible) return;
    // DEV: Always spawn a collectible every 5 seconds
    const spawn = () => {
      setCollectible({
        x: randomX(),
        y: 0,
        type: Math.random() < 0.5 ? 'hummus' : 'falafel',
      });
    };
    const timer = setTimeout(spawn, 5000);
    return () => clearTimeout(timer);
  }, [running, collectible]);

  // Game loop
  useEffect(() => {
    if (!running) return () => {};
    function loop() {
      setDrops((d) =>
        d
          .map((drop) => ({ ...drop, y: drop.y + DROP_SPEED }))
          .filter((drop) => drop.y < GAME_HEIGHT + DROP_RADIUS)
      );
      setCollectible((c) => (c ? { ...c, y: c.y + 2 } : c));
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [running]);

  // Collision detection & win/lose
  useEffect(() => {
    if (!running) return;
    // Drops
    if (!lifeLost) {
      for (const drop of drops) {
        const dx = drop.x - playerX;
        const dy = drop.y - (GAME_HEIGHT - 60);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PLAYER_RADIUS + DROP_RADIUS) {
          setLifeLost(true);
          loseHeart();
          if (hearts - 1 <= 0) {
            setRunning(false);
            setTimeout(() => setGameState('gameover'), 400);
          } else {
            setRunning(false);
            setTimeout(onLose, 400);
          }
          return;
        }
      }
    }
    // Collectible
    if (collectible) {
      const dx = collectible.x - playerX;
      const dy = collectible.y - (GAME_HEIGHT - 60);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PLAYER_RADIUS + 20) {
        gainHeart();
        setCollectible(null);
      } else if (collectible.y > GAME_HEIGHT + 20) {
        setCollectible(null);
      }
    }
    if (Date.now() - startTime.current > GAME_DURATION) {
      setRunning(false);
      setTimeout(onWin, 400);
    }
  }, [
    drops,
    playerX,
    onWin,
    onLose,
    running,
    collectible,
    gainHeart,
    loseHeart,
    hearts,
    setGameState,
    lifeLost,
  ]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // BG
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // Player
    ctx.beginPath();
    ctx.arc(playerX, GAME_HEIGHT - 60, PLAYER_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = '#1976d2';
    ctx.fill();
    // Drops
    ctx.fillStyle = '#90caf9';
    for (const drop of drops) {
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, DROP_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    }
    // Collectible
    if (collectible) {
      ctx.beginPath();
      ctx.arc(collectible.x, collectible.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = collectible.type === 'hummus' ? '#e0c066' : '#a0522d';
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.font = '16px sans-serif';
      ctx.fillText(
        collectible.type === 'hummus' ? '🥣' : '🥙',
        collectible.x - 12,
        collectible.y + 8
      );
    }
    // Text
    ctx.fillStyle = '#333';
    ctx.font = '20px sans-serif';
    ctx.fillText('Avoid the AC drops!', 16, 32);
  }, [drops, playerX, collectible]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5dc',
      }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{ border: '2px solid #222', borderRadius: 16, background: '#f5f5dc' }}
      />
    </div>
  );
}

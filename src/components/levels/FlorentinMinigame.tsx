import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../lib/gameStore';

type FlorentinMinigameProps = {
  onWin: () => void;
  onLose: () => void;
};

// Use aspect ratio from original game
const ASPECT_RATIO = 480 / 640;
const GAME_HEIGHT_PERCENT = 90; // 90% of viewport height
const PLAYER_RADIUS = 24;
const DROP_RADIUS = 16;
const DROP_SPEED = 3;
const DROP_INTERVAL = 900;
const GAME_DURATION = 20000; // 20 seconds

const characterImages = {
  nimrod: '/HIP.PNG',
  liat: '/POSH.png',
  reuven: '/YEMANI.PNG',
};

export default function FlorentinMinigame({ onWin, onLose }: FlorentinMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameWidth, setGameWidth] = useState(0);
  const [gameHeight, setGameHeight] = useState(0);
  const [playerX, setPlayerX] = useState(0);
  const [drops, setDrops] = useState<{ x: number; y: number; size: number }[]>([]);
  const [collectible, setCollectible] = useState<{
    x: number;
    y: number;
    type: 'hummus' | 'falafel';
  } | null>(null);
  const [running, setRunning] = useState(true);
  const [lifeLost, setLifeLost] = useState(false);
  const animationRef = useRef<number>();
  const startTime = useRef<number>(Date.now());
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const waterDropImageRef = useRef<HTMLImageElement | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const bgOffsetRef = useRef(0);

  const loseHeart = useGameStore((s) => s.loseHeart);
  const gainHeart = useGameStore((s) => s.gainHeart);
  const hearts = useGameStore((s) => s.filledPermanentHearts + s.temporaryHearts);
  const setGameState = useGameStore((s) => s.setGameState);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);

  // Initialize canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const vh = window.innerHeight;
      const gameHeight = (vh * GAME_HEIGHT_PERCENT) / 100;
      const gameWidth = gameHeight * ASPECT_RATIO;

      setGameHeight(gameHeight);
      setGameWidth(gameWidth);
      setPlayerX(gameWidth / 2);

      if (canvasRef.current) {
        canvasRef.current.width = gameWidth;
        canvasRef.current.height = gameHeight;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Random X position scaled to game width
  const randomX = () => {
    return Math.random() * (gameWidth - 2 * DROP_RADIUS) + DROP_RADIUS;
  };

  // Generate random drop size between 80 and 140px
  const randomDropSize = () => {
    return Math.floor(Math.random() * (140 - 80 + 1)) + 80;
  };

  // Load images: player, water drop, and background
  useEffect(() => {
    if (!selectedCharacter) return;

    const img = new Image();
    img.src = characterImages[selectedCharacter];
    img.onload = () => {
      playerImageRef.current = img;
    };

    const dropImg = new Image();
    dropImg.src = '/drop.png';
    dropImg.onload = () => {
      waterDropImageRef.current = dropImg;
    };

    const bgImg = new Image();
    bgImg.src = '/combined_street_panorama.png';
    bgImg.onload = () => {
      backgroundImageRef.current = bgImg;
    };
  }, [selectedCharacter]);

  // Handle mouse movement
  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      setPlayerX(Math.max(PLAYER_RADIUS, Math.min(gameWidth - PLAYER_RADIUS, x)));
    }
    const canvas = canvasRef.current;
    canvas?.addEventListener('mousemove', handleMouse);
    return () => canvas?.removeEventListener('mousemove', handleMouse);
  }, [gameWidth]);

  // Drop spawner
  useEffect(() => {
    if (!running || !gameWidth) return;
    let timeoutId: NodeJS.Timeout;
    function spawnDrop() {
      setDrops((d) => [...d, { x: randomX(), y: -DROP_RADIUS, size: randomDropSize() }]);
      timeoutId = setTimeout(spawnDrop, DROP_INTERVAL);
    }
    spawnDrop();
    return () => clearTimeout(timeoutId);
  }, [running, gameWidth]);

  // Occasionally spawn a collectible
  useEffect(() => {
    if (!running || collectible || !gameWidth) return;
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
  }, [running, collectible, gameWidth]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !gameWidth || !gameHeight) return;

    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // Background image with horizontal scrolling
    if (backgroundImageRef.current) {
      // Get original image dimensions
      const { width: imgW, height: imgH } = backgroundImageRef.current;

      // Calculate proper scaling to maintain aspect ratio
      // Scale to fit the height of the canvas perfectly
      const scale = gameHeight / imgH;
      const scaledWidth = imgW * scale;

      // Calculate offset based on scaled dimensions
      const offset = bgOffsetRef.current % scaledWidth;

      // Draw the background image for continuous horizontal scrolling
      // First copy
      ctx.drawImage(backgroundImageRef.current, -offset, 0, scaledWidth, gameHeight);

      // Second copy for seamless scrolling
      ctx.drawImage(backgroundImageRef.current, scaledWidth - offset, 0, scaledWidth, gameHeight);

      // Add semi-transparent overlay for better visibility
      ctx.fillStyle = 'rgba(245, 245, 220, 0.3)';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
    } else {
      // Fallback background
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
    }

    // Player
    if (playerImageRef.current && selectedCharacter) {
      // Draw player character image
      const playerHeight = gameHeight * 0.23; // Scale with canvas
      const aspectRatio = playerImageRef.current.width / playerImageRef.current.height;
      const playerWidth = playerHeight * aspectRatio;

      ctx.drawImage(
        playerImageRef.current,
        playerX - playerWidth / 2,
        gameHeight - 60 - playerHeight / 2,
        playerWidth,
        playerHeight
      );
    } else {
      // Fallback to circle if image not loaded
      ctx.beginPath();
      ctx.arc(playerX, gameHeight - 60, PLAYER_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = '#1976d2';
      ctx.fill();
    }

    // Drops - draw water drops using the image with varying sizes
    for (const drop of drops) {
      if (waterDropImageRef.current) {
        // Calculate width based on the height (size) to maintain aspect ratio
        const dropHeight = drop.size;
        const aspectRatio = waterDropImageRef.current.width / waterDropImageRef.current.height;
        const dropWidth = dropHeight * aspectRatio;

        // Draw water drop image with custom size
        ctx.drawImage(
          waterDropImageRef.current,
          drop.x - dropWidth / 2,
          drop.y - dropHeight / 2,
          dropWidth,
          dropHeight
        );
      } else {
        // Fallback to simple water drop if image not loaded
        // Scale the circle size based on drop size
        const scaledRadius = (drop.size / 100) * DROP_RADIUS;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, scaledRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#90caf9';
        ctx.fill();
      }
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
    ctx.font = Math.floor(gameWidth / 20) + 'px sans-serif';
    ctx.fillText('Avoid the AC water drops!', 16, 32);
  }, [drops, playerX, collectible, selectedCharacter, gameWidth, gameHeight]);

  // Game loop with background scrolling
  useEffect(() => {
    if (!running || !gameWidth) return () => {};
    function loop() {
      // Update background offset for horizontal scrolling
      // Get proper scaled width if background image is loaded
      if (backgroundImageRef.current) {
        const { width: imgW, height: imgH } = backgroundImageRef.current;
        const scale = gameHeight / imgH;
        const scaledWidth = imgW * scale;

        // Increment offset by 1px each frame and reset when a full image width has been scrolled
        bgOffsetRef.current = (bgOffsetRef.current + 1) % scaledWidth;
      } else {
        // Fallback if image isn't loaded yet
        bgOffsetRef.current = (bgOffsetRef.current + 1) % (gameWidth * 2);
      }

      setDrops((d) =>
        d
          .map((drop) => ({ ...drop, y: drop.y + DROP_SPEED }))
          .filter((drop) => drop.y < gameHeight + DROP_RADIUS)
      );
      setCollectible((c) => (c ? { ...c, y: c.y + 2 } : c));
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [running, gameWidth, gameHeight]);

  // Collision detection & win/lose
  useEffect(() => {
    if (!running || !gameWidth) return;
    // Drops
    if (!lifeLost) {
      for (const drop of drops) {
        const dx = drop.x - playerX;
        const dy = drop.y - (gameHeight - 60);
        // Adjust collision radius based on drop size
        const dropCollisionRadius = drop.size / 4; // Approximate collision radius based on visual size
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PLAYER_RADIUS + dropCollisionRadius) {
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
      const dy = collectible.y - (gameHeight - 60);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PLAYER_RADIUS + 20) {
        gainHeart();
        setCollectible(null);
      } else if (collectible.y > gameHeight + 20) {
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
    gameWidth,
    gameHeight,
  ]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5dc',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #222',
          borderRadius: 16,
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  );
}

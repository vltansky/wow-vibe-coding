import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../lib/gameStore';

export type MinigameTheme = {
  // Game elements
  enemyImage: string;
  collectibleImages: Record<string, string>;
  backgroundImage: string;

  // Game text
  instructionText: string;

  // Game mechanics
  enemyMinSize: number;
  enemyMaxSize: number;
  enemySpeed: number;
  enemySpawnInterval: number;

  // Visual settings
  backgroundOverlayColor?: string;
};

export type GenericMinigameProps = {
  onWin: () => void;
  onLose: () => void;
  theme: MinigameTheme;
  gameDuration?: number; // in milliseconds
};

const PLAYER_RADIUS = 24;

const characterImages = {
  nimrod: '/HIP.PNG',
  liat: '/POSH.png',
  reuven: '/YEMANI.PNG',
};

export default function GenericMinigame({
  onWin,
  onLose,
  theme,
  gameDuration = 20000, // Default 20 seconds
}: GenericMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [playerX, setPlayerX] = useState(0);
  const [enemies, setEnemies] = useState<{ x: number; y: number; size: number }[]>([]);
  const [collectible, setCollectible] = useState<{
    x: number;
    y: number;
    type: string;
  } | null>(null);
  const [running, setRunning] = useState(true);
  const [lifeLost, setLifeLost] = useState(false);
  const animationRef = useRef<number>();
  const startTime = useRef<number>(Date.now());
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const enemyImageRef = useRef<HTMLImageElement | null>(null);
  const collectibleImagesRef = useRef<Record<string, HTMLImageElement | null>>({});
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const bgOffsetRef = useRef(0);

  const loseHeart = useGameStore((s) => s.loseHeart);
  const gainHeart = useGameStore((s) => s.gainHeart);
  const hearts = useGameStore((s) => s.filledPermanentHearts + s.temporaryHearts);
  const setGameState = useGameStore((s) => s.setGameState);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);

  // Set canvas size to window size
  useEffect(() => {
    const updateSize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
      setPlayerX(window.innerWidth / 2);
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Random X position scaled to canvas width
  const randomX = () => {
    return Math.random() * (canvasSize.width - 50) + 25;
  };

  // Generate random enemy size between min and max
  const randomEnemySize = () => {
    return (
      Math.floor(Math.random() * (theme.enemyMaxSize - theme.enemyMinSize + 1)) + theme.enemyMinSize
    );
  };

  // Get random collectible type
  const getRandomCollectibleType = (): string => {
    const types = Object.keys(theme.collectibleImages);
    return types[Math.floor(Math.random() * types.length)];
  };

  // Load images: player, enemy, collectibles, and background
  useEffect(() => {
    if (!selectedCharacter) return;

    // Load player image
    const playerImg = new Image();
    playerImg.src = characterImages[selectedCharacter];
    playerImg.onload = () => {
      playerImageRef.current = playerImg;
    };

    // Load enemy image
    const enemyImg = new Image();
    enemyImg.src = theme.enemyImage;
    enemyImg.onload = () => {
      enemyImageRef.current = enemyImg;
    };

    // Load collectible images
    Object.entries(theme.collectibleImages).forEach(([type, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        collectibleImagesRef.current[type] = img;
      };
    });

    // Load background image
    const bgImg = new Image();
    bgImg.src = theme.backgroundImage;
    bgImg.onload = () => {
      backgroundImageRef.current = bgImg;
    };
  }, [selectedCharacter, theme]);

  // Handle mouse movement
  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      setPlayerX(Math.max(PLAYER_RADIUS, Math.min(canvasSize.width - PLAYER_RADIUS, x)));
    }
    const canvas = canvasRef.current;
    canvas?.addEventListener('mousemove', handleMouse);
    return () => canvas?.removeEventListener('mousemove', handleMouse);
  }, [canvasSize.width]);

  // Enemy spawner
  useEffect(() => {
    if (!running || !canvasSize.width) return;
    let timeoutId: NodeJS.Timeout;
    function spawnEnemy() {
      setEnemies((d) => [...d, { x: randomX(), y: -30, size: randomEnemySize() }]);
      timeoutId = setTimeout(spawnEnemy, theme.enemySpawnInterval);
    }
    spawnEnemy();
    return () => clearTimeout(timeoutId);
  }, [running, canvasSize.width, theme.enemySpawnInterval]);

  // Occasionally spawn a collectible
  useEffect(() => {
    if (!running || collectible || !canvasSize.width) return;
    // Spawn a collectible every 5 seconds
    const spawn = () => {
      setCollectible({
        x: randomX(),
        y: 0,
        type: getRandomCollectibleType(),
      });
    };
    const timer = setTimeout(spawn, 5000);
    return () => clearTimeout(timer);
  }, [running, collectible, canvasSize.width]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasSize.width || !canvasSize.height) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Background image with horizontal scrolling
    if (backgroundImageRef.current) {
      // Get original image dimensions
      const { width: imgW, height: imgH } = backgroundImageRef.current;

      // Calculate proper scaling to maintain aspect ratio
      // Scale to fit the height of the canvas perfectly
      const scale = canvasSize.height / imgH;
      const scaledWidth = imgW * scale;

      // Calculate offset based on scaled dimensions
      const offset = bgOffsetRef.current % scaledWidth;

      // Draw the background image for continuous horizontal scrolling
      // First copy
      ctx.drawImage(backgroundImageRef.current, -offset, 0, scaledWidth, canvasSize.height);

      // Second copy for seamless scrolling
      ctx.drawImage(
        backgroundImageRef.current,
        scaledWidth - offset,
        0,
        scaledWidth,
        canvasSize.height
      );

      // Add semi-transparent overlay for better visibility
      ctx.fillStyle = theme.backgroundOverlayColor || 'rgba(245, 245, 220, 0.3)';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    } else {
      // Fallback background
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    }

    // Player
    if (playerImageRef.current && selectedCharacter) {
      // Draw player character image
      const playerHeight = canvasSize.height * 0.23; // Scale with canvas
      const aspectRatio = playerImageRef.current.width / playerImageRef.current.height;
      const playerWidth = playerHeight * aspectRatio;

      ctx.drawImage(
        playerImageRef.current,
        playerX - playerWidth / 2,
        canvasSize.height - 60 - playerHeight / 2,
        playerWidth,
        playerHeight
      );
    } else {
      // Fallback to circle if image not loaded
      ctx.beginPath();
      ctx.arc(playerX, canvasSize.height - 60, PLAYER_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = '#1976d2';
      ctx.fill();
    }

    // Enemies - draw with custom image and varying sizes
    for (const enemy of enemies) {
      if (enemyImageRef.current) {
        // Calculate width based on the height (size) to maintain aspect ratio
        const enemyHeight = enemy.size;
        const aspectRatio = enemyImageRef.current.width / enemyImageRef.current.height;
        const enemyWidth = enemyHeight * aspectRatio;

        // Draw enemy image with custom size
        ctx.drawImage(
          enemyImageRef.current,
          enemy.x - enemyWidth / 2,
          enemy.y - enemyHeight / 2,
          enemyWidth,
          enemyHeight
        );
      } else {
        // Fallback to simple circle if image not loaded
        // Scale the circle size based on enemy size
        const scaledRadius = (enemy.size / 100) * 16;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, scaledRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#90caf9';
        ctx.fill();
      }
    }

    // Collectible
    if (collectible && collectible.type) {
      const collectibleImg = collectibleImagesRef.current[collectible.type];
      if (collectibleImg) {
        // Draw collectible image
        const collectibleSize = 40;
        const aspectRatio = collectibleImg.width / collectibleImg.height;
        const collectibleWidth = collectibleSize * aspectRatio;

        ctx.drawImage(
          collectibleImg,
          collectible.x - collectibleWidth / 2,
          collectible.y - collectibleSize / 2,
          collectibleWidth,
          collectibleSize
        );
      } else {
        // Fallback circle if image not loaded
        ctx.beginPath();
        ctx.arc(collectible.x, collectible.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#e0c066';
        ctx.fill();
      }
    }

    // Game instruction text
    ctx.fillStyle = '#333';
    ctx.font = Math.floor(canvasSize.width / 20) + 'px sans-serif';
    ctx.fillText(theme.instructionText, 16, 32);
  }, [enemies, playerX, collectible, selectedCharacter, canvasSize]);

  // Game loop with background scrolling
  useEffect(() => {
    if (!running || !canvasSize.width) return () => {};
    function loop() {
      // Update background offset for horizontal scrolling
      // Get proper scaled width if background image is loaded
      if (backgroundImageRef.current) {
        const { width: imgW, height: imgH } = backgroundImageRef.current;
        const scale = canvasSize.height / imgH;
        const scaledWidth = imgW * scale;

        // Increment offset by 1px each frame and reset when a full image width has been scrolled
        bgOffsetRef.current = (bgOffsetRef.current + 1) % scaledWidth;
      } else {
        // Fallback if image isn't loaded yet
        bgOffsetRef.current = (bgOffsetRef.current + 1) % (canvasSize.width * 2);
      }

      setEnemies((d) =>
        d
          .map((enemy) => ({ ...enemy, y: enemy.y + theme.enemySpeed }))
          .filter((enemy) => enemy.y < canvasSize.height + 50)
      );
      setCollectible((c) => (c ? { ...c, y: c.y + 2 } : c));
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [running, canvasSize.width, canvasSize.height, theme.enemySpeed]);

  // Collision detection & win/lose
  useEffect(() => {
    if (!running || !canvasSize.width) return;
    // Enemies
    if (!lifeLost) {
      for (const enemy of enemies) {
        const dx = enemy.x - playerX;
        const dy = enemy.y - (canvasSize.height - 60);
        // Adjust collision radius based on enemy size
        const enemyCollisionRadius = enemy.size / 4; // Approximate collision radius based on visual size
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PLAYER_RADIUS + enemyCollisionRadius) {
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
      const dy = collectible.y - (canvasSize.height - 60);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PLAYER_RADIUS + 20) {
        gainHeart();
        setCollectible(null);
      } else if (collectible.y > canvasSize.height + 20) {
        setCollectible(null);
      }
    }
    if (Date.now() - startTime.current > gameDuration) {
      setRunning(false);
      setTimeout(onWin, 400);
    }
  }, [
    enemies,
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
    canvasSize,
    gameDuration,
  ]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#f5f5dc',
        zIndex: 1000,
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

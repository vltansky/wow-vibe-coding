import { useEffect, useRef } from 'react';

type ScrollingBackgroundProps = {
  speed?: number; // px per frame
  height?: number; // px
};

const IMAGE_SRC = '/combined_street_panorama.png';
const DEFAULT_SPEED = 2;
const DEFAULT_HEIGHT = 320;

export function ScrollingBackground({
  speed = DEFAULT_SPEED,
  height = DEFAULT_HEIGHT,
}: ScrollingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    const img = new window.Image();
    img.src = IMAGE_SRC;
    img.onload = () => {
      imgRef.current = img;
      const draw = () => {
        if (!running || !imgRef.current) return;
        const { width: imgW, height: imgH } = imgRef.current;
        const scale = height / imgH;
        const drawW = imgW * scale;
        const drawH = height;
        const canvasW = canvas.width;
        ctx.clearRect(0, 0, canvasW, drawH);
        // Draw two images for seamless loop
        let x = -offsetRef.current;
        while (x < canvasW) {
          ctx.drawImage(imgRef.current, x, 0, drawW, drawH);
          x += drawW;
        }
        offsetRef.current += speed;
        if (offsetRef.current >= drawW) {
          offsetRef.current -= drawW;
        }
        animationRef.current = requestAnimationFrame(draw);
      };
      draw();
    };
    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [speed, height]);

  // Responsive width
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = height;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

import { useEffect } from 'react';

type BusTransitionProps = {
  onComplete: () => void;
};

const BusTransition = ({ onComplete }: BusTransitionProps) => {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 2000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e0eafc',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        pointerEvents: 'all',
      }}
    >
      {/* Placeholder bus stop animation */}
      <svg width="300" height="120">
        <rect x="0" y="80" width="300" height="40" fill="#b0b0b0" />
        <rect x="40" y="60" width="60" height="20" fill="#222" />
        <rect x="120" y="40" width="120" height="40" fill="#1976d2" rx="10" />
        <circle cx="140" cy="80" r="10" fill="#fff" />
        <circle cx="220" cy="80" r="10" fill="#fff" />
      </svg>
      <span style={{ marginLeft: 32, fontSize: 24 }}>Waiting for the bus…</span>
    </div>
  );
};

export default BusTransition;

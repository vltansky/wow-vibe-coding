import React from 'react';
import type { Neighborhood, CharacterId, GameState } from '../lib/gameStore';

const characterImages: Record<CharacterId, string> = {
  nimrod: '/HIP.PNG',
  liat: '/POSH.png',
  reuven: '/YEMANI.PNG',
  josef: '/NEVORISH.png',
  hila: '/MOM.png',
};

// Pulse animation for uncompleted areas
const pulseStyle = `
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(51,136,255,0.5); }
  70% { box-shadow: 0 0 0 10px rgba(51,136,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(51,136,255,0); }
}
`;

export type MapScreenOverlayProps = {
  completedNeighborhoods: Neighborhood[];
  selectedCharacter: CharacterId | null;
  gameState: GameState;
};

const MapScreenOverlay = ({ selectedCharacter, gameState }: MapScreenOverlayProps) => {
  // Show avatar only during transition
  const showAvatar = gameState === 'transition' && selectedCharacter;

  return (
    <>
      <style>{pulseStyle}</style>
      {/* Instructions at the top */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 0,
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            padding: '20px 48px',
            fontSize: 28,
            fontWeight: 700,
            color: '#1976d2',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            pointerEvents: 'auto',
          }}
        >
          Click on a neighborhood to start
        </div>
      </div>

      {/* Legend (top right) */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          right: 32,
          zIndex: 10,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 10,
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          fontSize: 18,
          minWidth: 180,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              border: '2px solid #3388ff',
              borderRadius: 4,
              marginRight: 8,
              animation: 'pulse 1.5s infinite',
              background: 'white',
            }}
          />
          <span>Uncompleted area</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              border: '2px dashed #bbb',
              borderRadius: 4,
              marginRight: 8,
              background: 'white',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: -10,
                right: -12,
                fontSize: 18,
              }}
            >
              ⭐️
            </span>
          </span>
          <span>Completed area</span>
        </div>
      </div>

      {/* Avatar overlay (centered for now, animate later) */}
      {showAvatar && selectedCharacter && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <img
            src={characterImages[selectedCharacter]}
            alt="Character avatar"
            style={{
              width: 120,
              height: 120,
              objectFit: 'contain',
              borderRadius: '50%',
              border: '4px solid #fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}
          />
        </div>
      )}
    </>
  );
};

export default MapScreenOverlay;

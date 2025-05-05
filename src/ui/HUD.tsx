import { useGameStore, GameStore, Collectible } from '../lib/gameStore';

const heartIcon = '❤️';
const emptyHeartIcon = '🤍';
const tempHeartIcon = '💛';
const hummusIcon = '🥣';
const falafelIcon = '🥙';

const HUD = () => {
  const filledPermanentHearts = useGameStore((s: GameStore) => s.filledPermanentHearts);
  const permanentHearts = useGameStore((s: GameStore) => s.permanentHearts);
  const temporaryHearts = useGameStore((s: GameStore) => s.temporaryHearts);
  const collectedItems = useGameStore((s: GameStore) => s.collectedItems);

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 12,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 1001,
        fontSize: 20,
      }}
    >
      <span>
        {/* Permanent hearts (1-5) */}
        {Array.from({ length: permanentHearts }).map((_, i: number) =>
          i < filledPermanentHearts ? (
            <span key={i}>{heartIcon}</span>
          ) : (
            <span key={i}>{emptyHeartIcon}</span>
          )
        )}
        {/* Temporary hearts (6+) */}
        {Array.from({ length: temporaryHearts }).map((_, i: number) => (
          <span key={`temp-${i}`}>{tempHeartIcon}</span>
        ))}
      </span>
      <span>
        {collectedItems.map((item: Collectible, i: number) =>
          item === 'hummus' ? <span key={i}>{hummusIcon}</span> : <span key={i}>{falafelIcon}</span>
        )}
      </span>
    </div>
  );
};

export default HUD;

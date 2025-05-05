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
  const completedNeighborhoods = useGameStore((s) => s.completedNeighborhoods);
  const totalAreas = 9; // Update if you add/remove playable areas

  return (
    <div className="pointer-events-none absolute top-0 left-0 z-50 flex w-full flex-col items-center p-4">
      <div className="pointer-events-auto mb-2 flex gap-2">
        {/* Permanent hearts (1-5) */}
        {Array.from({ length: permanentHearts }).map((_, i: number) =>
          i < filledPermanentHearts ? (
            <span key={i} style={{ opacity: 1, color: '#e63946', fontSize: 32 }}>
              {heartIcon}
            </span>
          ) : (
            <span key={i} style={{ opacity: 0.3, color: '#e63946', fontSize: 32 }}>
              {emptyHeartIcon}
            </span>
          )
        )}
        {/* Temporary hearts (6+) */}
        {Array.from({ length: temporaryHearts }).map((_, i: number) => (
          <span key={`temp-${i}`} style={{ color: '#ffd700', fontSize: 32 }}>
            {tempHeartIcon}
          </span>
        ))}
      </div>
      <div className="pointer-events-auto rounded bg-white/80 px-4 py-1 text-base text-gray-700 shadow">
        Areas completed {completedNeighborhoods.length} out of {totalAreas}
      </div>
      <span>
        {collectedItems.map((item: Collectible, i: number) =>
          item === 'hummus' ? <span key={i}>{hummusIcon}</span> : <span key={i}>{falafelIcon}</span>
        )}
      </span>
    </div>
  );
};

export default HUD;

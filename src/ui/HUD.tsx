import { useGameStore, GameStore, Collectible } from '../lib/gameStore';

const heartIcon = '❤️';
const emptyHeartIcon = '🤍';
const tempHeartIcon = '💛';
const hummusIcon = '🥣';
const falafelIcon = '🥙';

type HUDProps = {
  minigameScore?: number;
  minigameInstruction?: string;
  extraTopMargin?: boolean;
};

const HUD = ({ minigameScore, minigameInstruction, extraTopMargin = false }: HUDProps) => {
  const filledPermanentHearts = useGameStore((s: GameStore) => s.filledPermanentHearts);
  const permanentHearts = useGameStore((s: GameStore) => s.permanentHearts);
  const temporaryHearts = useGameStore((s: GameStore) => s.temporaryHearts);
  const collectedItems = useGameStore((s: GameStore) => s.collectedItems);
  const completedNeighborhoods = useGameStore((s) => s.completedNeighborhoods);
  const totalAreas = 9; // Update if you add/remove playable areas

  return (
    <div
      className={`pointer-events-none absolute top-0 left-0 z-50 flex w-full flex-col items-center gap-4 p-6 ${extraTopMargin ? 'mt-32 md:mt-40' : ''}`}
    >
      {typeof minigameScore === 'number' && minigameInstruction && (
        <div className="pointer-events-auto mb-6 flex flex-col items-center gap-2">
          <div className="rounded bg-white/90 px-8 py-3 text-2xl font-bold text-gray-900 shadow">
            {minigameInstruction}
          </div>
          <div className="rounded bg-white/90 px-8 py-3 text-xl font-bold text-blue-700 shadow">
            Score: {minigameScore}/10
          </div>
        </div>
      )}
      <div className="pointer-events-auto mb-4 flex gap-3">
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
      <div className="pointer-events-auto mb-2 rounded bg-white/80 px-6 py-2 text-base text-gray-700 shadow">
        Areas completed {completedNeighborhoods.length} out of {totalAreas}
      </div>
      <span className="mt-2 flex gap-2">
        {collectedItems.map((item: Collectible, i: number) =>
          item === 'hummus' ? <span key={i}>{hummusIcon}</span> : <span key={i}>{falafelIcon}</span>
        )}
      </span>
    </div>
  );
};

export default HUD;

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
  remainingTime?: number;
  neighborhoodName?: string | null;
};

const TimeWheel = ({ remainingTime = 30 }: { remainingTime: number }) => {
  const size = 54;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const progress = Math.max(0, Math.min(1, remainingTime / 30));
  const angle = 2 * Math.PI * progress;
  let color = '#22c55e'; // green
  if (remainingTime <= 5)
    color = '#ef4444'; // red
  else if (remainingTime <= 10) color = '#eab308'; // yellow
  return (
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
      />
      <path
        d={`M${center},${center} m0,-${radius} a${radius},${radius} 0 1,1 0,${radius * 2} a${radius},${radius} 0 1,1 0,-${radius * 2}`}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${angle * radius} ${2 * Math.PI * radius}`}
        strokeDashoffset={0}
        style={{ transition: 'stroke 0.2s, stroke-dasharray 0.2s' }}
      />
      <text
        x={center}
        y={center + 6}
        textAnchor="middle"
        fontSize="16"
        fill="#222"
        fontWeight="bold"
      >
        {Math.ceil(remainingTime)}
      </text>
    </svg>
  );
};

const HUD = ({
  minigameScore,
  minigameInstruction,
  extraTopMargin = false,
  remainingTime,
  neighborhoodName,
}: HUDProps) => {
  const health = useGameStore((s: GameStore) => s.health);
  const collectedItems = useGameStore((s: GameStore) => s.collectedItems);
  const completedNeighborhoods = useGameStore((s) => s.completedNeighborhoods);
  const totalAreas = 9; // Update if you add/remove playable areas

  return (
    <div
      className={`pointer-events-none absolute top-0 left-0 z-50 flex w-full flex-col items-center gap-4 p-6 ${extraTopMargin ? 'mt-32 md:mt-40' : ''}`}
    >
      {remainingTime !== undefined && <TimeWheel remainingTime={remainingTime} />}
      {neighborhoodName && (
        <div className="pointer-events-auto mb-2 rounded bg-white/90 px-6 py-2 text-lg font-bold text-gray-900 shadow">
          {neighborhoodName}
        </div>
      )}
      {typeof minigameScore === 'number' && minigameInstruction && (
        <div className="pointer-events-auto mb-6 flex flex-col items-center gap-2">
          <div className="rounded bg-white/90 px-8 py-3 text-2xl font-bold text-gray-900 shadow">
            {minigameInstruction}
          </div>
          <div className="rounded bg-white/90 px-8 py-3 text-xl font-bold text-blue-700 shadow">
            Score: {minigameScore}/100
          </div>
        </div>
      )}
      <div className="pointer-events-auto mb-4 flex gap-3">
        {/* Permanent hearts (1-5) */}
        {Array.from({ length: 5 }).map((_, i: number) =>
          i < health.permanentHearts ? (
            <span key={i} style={{ opacity: 1, color: '#e63946', fontSize: 32 }}>
              {heartIcon}
            </span>
          ) : (
            <span key={i} style={{ opacity: 1, color: '#e63946', fontSize: 32 }}>
              {emptyHeartIcon}
            </span>
          )
        )}
        {/* Temporary hearts (6+) */}
        {Array.from({ length: health.temporaryHearts }).map((_, i: number) => (
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

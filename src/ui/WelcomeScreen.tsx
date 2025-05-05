import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../lib/gameStore';

const characters = [
  {
    id: 'nimrod',
    name: 'Nimrod from Florentin',
    description: 'Hipster with sunglasses, beard and tattoos',
    imagePath: '/HIP.PNG',
  },
  {
    id: 'liat',
    name: 'Liat from Neve Tsedek',
    description: 'Stylish with a designer bag and smartphone',
    imagePath: '/POSH.png',
  },
  {
    id: 'reuven',
    name: 'Reuven from Kerem HaTeimanim',
    description: 'Traditional with classic style and wisdom',
    imagePath: '/YEMANI.PNG',
  },
];

type Character = (typeof characters)[number];

export function WelcomeScreen() {
  const [selected, setSelected] = useState<Character | null>(null);
  const setSelectedCharacter = useGameStore((s) => s.setSelectedCharacter);
  const setGameState = useGameStore((s) => s.setGameState);

  // Set default selected character to first one
  useEffect(() => {
    if (!selected && characters.length > 0) {
      setSelected(characters[0]);
    }
  }, []);

  const handleStart = () => {
    if (selected) {
      setSelectedCharacter(selected.id as import('../lib/gameStore').CharacterId);
      setGameState('map');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-100 to-blue-200 p-6">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Tel Aviv Escape!</h1>
      <p className="mb-6 max-w-xl text-center text-lg">
        Choose your player and get ready to explore Tel Aviv's quirkiest neighborhoods. Complete all
        areas to win a Wolt delivery! You have 5 hearts. Lose them all and it's game over. Collect
        hummus or falafel to restore hearts. Avoid enemies unique to each area. Good luck!
      </p>

      <div className="flex w-full max-w-5xl flex-col justify-between gap-8 md:flex-row">
        {/* Left side - Character selection icons in grid */}
        <div className="flex flex-col md:w-1/3">
          <h2 className="mb-4 text-xl font-semibold">Choose your character:</h2>
          <div className="grid grid-cols-3 gap-2">
            {characters.map((char) => (
              <button
                key={char.id}
                className={`flex aspect-square items-center justify-center overflow-hidden rounded-md bg-slate-800 p-1 transition-all hover:ring-2 hover:ring-yellow-400 ${
                  selected?.id === char.id ? 'ring-2 ring-yellow-400' : ''
                }`}
                onClick={() => setSelected(char)}
                type="button"
              >
                <div
                  className="relative h-full w-full overflow-hidden"
                  style={{ background: 'radial-gradient(circle, #4a4a4a 0%, #1a1a1a 100%)' }}
                >
                  <img
                    src={char.imagePath}
                    alt={char.name}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: 'top left',
                      transform: 'scale(2)',
                      top: '50%',
                      left: '10%',
                      position: 'relative',
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Character showcase */}
        <div className="bg-opacity-70 flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg md:w-2/3">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold">{selected?.name}</h2>
            <p className="text-gray-600">{selected?.description}</p>
          </div>

          <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-lg bg-amber-100">
            {/* Character "stage" */}
            <div className="absolute bottom-0 h-4 w-full bg-amber-300"></div>

            {selected && (
              <div className="z-10 mb-2 h-[350px]">
                <img
                  src={selected.imagePath}
                  alt={selected.name}
                  className="h-full object-contain"
                />
              </div>
            )}
          </div>

          <Button
            className="mt-8 px-8 py-6 text-lg"
            disabled={!selected}
            size="lg"
            onClick={handleStart}
          >
            Start Adventure
          </Button>
        </div>
      </div>
    </div>
  );
}

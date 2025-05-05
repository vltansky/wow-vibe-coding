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
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-100 to-blue-200 p-6">
      {/* Title and intro with Kanisah font */}
      <h1 className="mb-4 text-5xl font-bold" style={{ fontFamily: 'Kanisah, sans-serif' }}>
        Welcome to Tel Aviv Escape!
      </h1>

      <p className="mb-10 max-w-xl text-center text-lg">
        Choose your player and get ready to explore Tel Aviv's quirkiest neighborhoods. Complete all
        areas to win a Wolt delivery! You have 5 hearts. Lose them all and it's game over. Collect
        hummus or falafel to restore hearts. Avoid enemies unique to each area. Good luck!
      </p>

      {/* Character carousel - responsive for mobile */}
      <div className="mb-8 flex w-full flex-col justify-center gap-16 md:flex-row md:gap-10">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`relative flex transform cursor-pointer flex-col items-center transition-all duration-300 ${
              selected?.id === char.id ? 'scale-110' : 'scale-90 opacity-70 hover:opacity-90'
            }`}
            onClick={() => setSelected(char)}
          >
            {/* Character image with no background container */}
            <div className="relative h-[250px] md:h-[400px]">
              <img src={char.imagePath} alt={char.name} className="h-full object-contain" />

              {/* Selection indicator */}
              {selected?.id === char.id && (
                <div className="absolute -bottom-5 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-yellow-400" />
              )}
            </div>

            {/* Character name with Kanisah font */}
            <h3
              className="mt-6 text-center text-xl md:text-2xl"
              style={{ fontFamily: 'Kanisah, sans-serif' }}
            >
              {char.name}
            </h3>

            {/* Character description only shown for selected character */}
            {selected?.id === char.id && (
              <p className="mt-2 max-w-xs text-center text-gray-700">{char.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Start button fixed at bottom of screen */}
      <div className="fixed right-0 bottom-10 left-0 flex justify-center">
        <Button className="px-12 py-6 text-xl" disabled={!selected} size="lg" onClick={handleStart}>
          Start Adventure
        </Button>
      </div>
    </div>
  );
}

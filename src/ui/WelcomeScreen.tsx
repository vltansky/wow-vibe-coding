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
  {
    id: 'nevorish',
    name: 'Nevorish from Old North',
    description: 'Slick real estate mogul with keys and phone',
    imagePath: '/NEVORISH.png',
  },
  {
    id: 'mom',
    name: 'Mom from Park Hamesila',
    description: 'Trendy mom with stroller and coffee',
    imagePath: '/MOM.png',
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
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-100 to-blue-200 p-6 pb-[120px]">
      <h1
        className="mt-24 mb-12 text-5xl font-bold"
        style={{ fontFamily: 'Kanisah, sans-serif', padding: '25px' }}
      >
        Welcome to Tel Aviv Escape!
      </h1>

      <p className="mb-24 max-w-xl text-center text-lg" style={{ padding: '25px' }}>
        Choose your player and get ready to explore Tel Aviv's quirkiest neighborhoods. Complete all
        areas to win a Wolt delivery! You have 5 hearts. Lose them all and it's game over. Collect
        hummus or falafel to restore hearts. Avoid enemies unique to each area. Good luck!
      </p>

      {/* Character carousel - responsive for mobile */}
      <div className="mb-24 flex w-full flex-col justify-center gap-16 md:flex-row md:gap-10">
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
        <Button
          className="px-20 py-8 text-2xl"
          disabled={!selected}
          size="lg"
          onClick={handleStart}
        >
          Start Adventure
        </Button>
      </div>
    </div>
  );
}

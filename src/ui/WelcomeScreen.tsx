import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../lib/gameStore';

const characters = [
  {
    id: 'hipster',
    name: 'Hipster from Florentin',
    description: 'Thrift clothes, tattoos, joint',
    avatar: '🧔‍♂️', // Placeholder, replace with 2D art
  },
  {
    id: 'push',
    name: 'Push from Neve Tzedek',
    description: 'All brands, blond, selfie-ready',
    avatar: '👱‍♀️',
  },
  {
    id: 'yemenite',
    name: 'Old Yemenite from the Kerem',
    description: 'Jachnun, kippah, monochrome clothes',
    avatar: '🧓',
  },
  {
    id: 'pilates',
    name: 'Pilates Mom from the Old North',
    description: 'Lululemon, Vagabond stroller',
    avatar: '👩‍🦰',
  },
  {
    id: 'novorich',
    name: 'Novorich from Kikar Hamedina',
    description: 'Designer-everything, superiority vibes',
    avatar: '🕴️',
  },
];

type Character = (typeof characters)[number];

export function WelcomeScreen() {
  const [selected, setSelected] = useState<Character | null>(null);
  const setSelectedCharacter = useGameStore((s) => s.setSelectedCharacter);
  const setGameState = useGameStore((s) => s.setGameState);

  const handleStart = () => {
    if (selected) {
      setSelectedCharacter(selected.id as import('../lib/gameStore').CharacterId);
      setGameState('map');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-blue-200 p-6">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Tel Aviv Escape!</h1>
      <p className="mb-6 max-w-xl text-center text-lg">
        Choose your player and get ready to explore Tel Aviv's quirkiest neighborhoods. Complete all
        areas to win a Wolt delivery! You have 5 hearts. Lose them all and it's game over. Collect
        hummus or falafel to restore hearts. Avoid enemies unique to each area. Good luck!
      </p>
      <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3">
        {characters.map((char) => (
          <button
            key={char.id}
            className={`flex flex-col items-center rounded-lg border-2 bg-white p-4 shadow-md transition-all hover:border-blue-500 ${selected?.id === char.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'}`}
            onClick={() => setSelected(char)}
            type="button"
          >
            <span className="mb-2 text-5xl">{char.avatar}</span>
            <span className="font-semibold">{char.name}</span>
            <span className="text-xs text-gray-500">{char.description}</span>
          </button>
        ))}
      </div>
      <Button disabled={!selected} size="lg" onClick={handleStart}>
        Start Adventure
      </Button>
    </div>
  );
}

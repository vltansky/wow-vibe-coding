import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/stores/gameStore';

export function MultiplayerUI() {
  const [nickname, setNickname] = useState('');
  const [showControls, setShowControls] = useState(false);

  const isConnected = useGameStore((state) => state.isConnected);
  const isConnecting = useGameStore((state) => state.isConnecting);
  const connectionError = useGameStore((state) => state.connectionError);
  const playerCount = useGameStore((state) => state.playerCount);
  const connect = useGameStore((state) => state.connect);
  const disconnect = useGameStore((state) => state.disconnect);
  const localPlayerNickname = useGameStore((state) => {
    const localPlayerId = state.localPlayerId;
    return localPlayerId ? state.players[localPlayerId]?.nickname || 'Player' : 'Player';
  });

  const handleConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Use a fixed room ID and pass the nickname
    connect('game-room', nickname.trim() || 'Player');
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  return (
    <div className="absolute top-0 right-0 z-10 w-80 p-4 text-white">
      <div className="bg-opacity-80 rounded-lg bg-gray-900 p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Multiplayer</h2>

        {connectionError && (
          <div className="bg-opacity-80 mb-4 rounded bg-red-900 p-2 text-sm">{connectionError}</div>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Name: {localPlayerNickname}</span>
              <span>Players: {playerCount}</span>
            </div>

            <Button variant="destructive" className="w-full" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleConnect}>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Nickname</label>
              <Input
                type="text"
                value={nickname}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setNickname(e.target.value);
                }}
                autoFocus
                placeholder="Enter your nickname"
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>

            <Button variant="default" className="w-full" type="submit" disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Join Game'}
            </Button>
          </form>
        )}

        <div className="mt-8">
          <Button variant="outline" className="w-full text-sm" onClick={toggleControls}>
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </Button>

          {showControls && (
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p>WASD or Arrow Keys - Move</p>
              <p>Space - Jump</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

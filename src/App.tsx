import { useGameStore, GameStore } from './lib/gameStore';
import { WelcomeScreen } from './ui/WelcomeScreen';
import { MapScreen } from './ui/MapScreen';
import BusTransition from './ui/BusTransition';
import MinigameContainer from './ui/MinigameContainer';
import GameOverScreen from './ui/GameOverScreen';
import VictoryScreen from './ui/VictoryScreen';
import HUD from './ui/HUD';

function App() {
  const gameState = useGameStore((s: GameStore) => s.gameState);
  const setGameState = useGameStore((s: GameStore) => s.setGameState);
  const reset = useGameStore((s: GameStore) => s.reset);

  return (
    <>
      {(gameState === 'map' || gameState === 'minigame') && <HUD />}
      {gameState === 'welcome' && <WelcomeScreen />}
      {gameState === 'map' && <MapScreen />}
      {gameState === 'transition' && <BusTransition onComplete={() => setGameState('minigame')} />}
      {gameState === 'minigame' && (
        <MinigameContainer onWin={() => setGameState('map')} onLose={() => setGameState('map')} />
      )}
      {gameState === 'gameover' && <GameOverScreen onRestart={reset} />}
      {gameState === 'victory' && <VictoryScreen onRestart={reset} />}
    </>
  );
}

export default App;

import GenericMinigame, { MinigameTheme } from './GenericMinigame';

type OldNorthMinigameProps = {
  onWin: () => void;
  onLose: () => void;
};

// Old North theme with bicycles as enemies
const oldNorthTheme: MinigameTheme = {
  enemyImage: '/drop.png', // This would be replaced with a bicycle image
  collectibleImages: {
    falafel: '/falafel.png',
    pita: '/pita.png',
  },
  pointItems: {
    falafel: '/falafel.png',
  },
  backgroundImage: '/combined_street_panorama.png', // Would be replaced with Old North street
  instructionText: 'Dodge the bicycles!',
  enemyMinSize: 60, // Bicycles are smaller than water drops
  enemyMaxSize: 120,
  enemySpeed: 4.4, // 10% faster
  enemySpawnInterval: 1080, // 10% less
  backgroundOverlayColor: 'rgba(240, 240, 250, 0.3)', // Slightly different overlay color
};

export default function OldNorthMinigame({ onWin, onLose }: OldNorthMinigameProps) {
  return (
    <GenericMinigame
      onWin={onWin}
      onLose={onLose}
      theme={oldNorthTheme}
      gameDuration={25000} // 25 seconds, slightly longer than Florentin
    />
  );
}

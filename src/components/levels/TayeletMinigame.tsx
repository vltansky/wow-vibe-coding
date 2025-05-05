import GenericMinigame, { MinigameTheme } from './GenericMinigame';

type TayeletMinigameProps = {
  onWin: () => void;
  onLose: () => void;
};

// Old North theme with bicycles as enemies
const TayeletTheme: MinigameTheme = {
  enemyImage: '/sun.png', // This would be replaced with a bicycle image
  collectibleImages: {
    coffee: '/falafel.png', // This would be replaced with coffee image
    croissant: '/falafel.png', // This would be replaced with croissant image
  },
  backgroundImage: '/beach_background.jpg', // Would be replaced with Old North street
  instructionText: 'Avoid the sun and collect suncream and shimshiot!',
  enemyMinSize: 60, // Bicycles are smaller than water drops
  enemyMaxSize: 120,
  enemySpeed: 4, // Bicycles are faster than water drops
  enemySpawnInterval: 1200, // But spawn less frequently
  backgroundOverlayColor: 'rgba(240, 240, 250, 0.3)', // Slightly different overlay color
};

export default function TayeletMinigame({ onWin, onLose }: TayeletMinigameProps) {
  return (
    <GenericMinigame
      onWin={onWin}
      onLose={onLose}
      theme={TayeletTheme}
      gameDuration={25000} // 25 seconds, slightly longer than Florentin
    />
  );
}

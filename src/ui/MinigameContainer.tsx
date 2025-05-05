import { useGameStore } from '../lib/gameStore';
import FlorentinMinigame from '../components/levels/FlorentinMinigame';
import OldNorthMinigame from '../components/levels/OldNorthMinigame';

type MinigameContainerProps = {
  onWin: () => void;
  onLose: () => void;
};

const MinigameContainer = ({ onWin, onLose }: MinigameContainerProps) => {
  const selectedNeighborhood = useGameStore((s) => s.selectedNeighborhood);

  // Select the appropriate minigame based on the neighborhood
  switch (selectedNeighborhood) {
    case 'Old North':
      return <OldNorthMinigame onWin={onWin} onLose={onLose} />;
    case 'Florentin':
    default:
      // Default to Florentin for MVP or if neighborhood is not selected
      return <FlorentinMinigame onWin={onWin} onLose={onLose} />;
  }
};

export default MinigameContainer;

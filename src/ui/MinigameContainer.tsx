import FlorentinMinigame from '../components/levels/FlorentinMinigame';

type MinigameContainerProps = {
  onWin: () => void;
  onLose: () => void;
};

const MinigameContainer = ({ onWin, onLose }: MinigameContainerProps) => {
  // For MVP, just use Florentin as the current minigame
  // Later, use a selectedNeighborhood from store
  return <FlorentinMinigame onWin={onWin} onLose={onLose} />;
};

export default MinigameContainer;

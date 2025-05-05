import create from 'zustand';

export type GameState = 'welcome' | 'map' | 'transition' | 'minigame' | 'gameover' | 'victory';

export type CharacterId = 'nimrod' | 'liat' | 'reuven';

export type Neighborhood =
  | 'Florentin'
  | 'Old North'
  | 'Kerem'
  | 'Park Hamesila'
  | 'Kaplan'
  | 'Rothschild'
  | "Neve Sha'anan"
  | 'Beach/Tayelet'
  | 'Neve Tzedek'
  | 'Memadion';

export type Collectible = 'hummus' | 'falafel';

export type GameStore = {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  selectedCharacter: CharacterId | null;
  setSelectedCharacter: (id: CharacterId) => void;
  selectedNeighborhood: Neighborhood | null;
  setSelectedNeighborhood: (n: Neighborhood) => void;
  permanentHearts: number; // always 5
  filledPermanentHearts: number; // 0-5
  temporaryHearts: number; // 0+
  loseHeart: () => void;
  gainHeart: () => void;
  completedNeighborhoods: Neighborhood[];
  completeNeighborhood: (n: Neighborhood) => void;
  collectedItems: Collectible[];
  collectItem: (item: Collectible) => void;
  reset: () => void;
  selectedMinigame: string | null;
  setSelectedMinigame: (minigame: string) => void;
};

const PERMANENT_HEARTS = 5;

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'welcome',
  setGameState: (gameState) => set({ gameState }),
  selectedCharacter: null,
  setSelectedCharacter: (id) => set({ selectedCharacter: id }),
  selectedNeighborhood: null,
  setSelectedNeighborhood: (n) => set({ selectedNeighborhood: n }),
  permanentHearts: PERMANENT_HEARTS,
  filledPermanentHearts: PERMANENT_HEARTS,
  temporaryHearts: 0,
  loseHeart: () =>
    set((s) => {
      if (s.temporaryHearts > 0) {
        return {
          temporaryHearts: s.temporaryHearts - 1,
          filledPermanentHearts: s.filledPermanentHearts,
        };
      } else {
        return {
          filledPermanentHearts: Math.max(0, s.filledPermanentHearts - 1),
          temporaryHearts: s.temporaryHearts,
        };
      }
    }),
  gainHeart: () =>
    set((s) => {
      if (s.filledPermanentHearts < s.permanentHearts) {
        return {
          filledPermanentHearts: s.filledPermanentHearts + 1,
          temporaryHearts: s.temporaryHearts,
        };
      } else {
        return {
          temporaryHearts: s.temporaryHearts + 1,
          filledPermanentHearts: s.filledPermanentHearts,
        };
      }
    }),
  completedNeighborhoods: [],
  completeNeighborhood: (n) =>
    set((s) => ({ completedNeighborhoods: [...s.completedNeighborhoods, n] })),
  collectedItems: [],
  collectItem: (item) => set((s) => ({ collectedItems: [...s.collectedItems, item] })),
  reset: () =>
    set({
      gameState: 'welcome',
      selectedCharacter: null,
      selectedNeighborhood: null,
      permanentHearts: PERMANENT_HEARTS,
      filledPermanentHearts: PERMANENT_HEARTS,
      temporaryHearts: 0,
      completedNeighborhoods: [],
      collectedItems: [],
    }),
  selectedMinigame: null,
  setSelectedMinigame: (minigame) => set({ selectedMinigame: minigame }),
}));

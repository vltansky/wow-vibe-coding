import { create } from 'zustand';
import { PeerManager } from '@/lib/networking/peerManager';
import { PeerData } from '@/lib/networking/peer';
import { Vector3, Quaternion } from 'three';

// Unique identifier for a player
export type PlayerId = string;

// Player state that gets synced across the network
export type PlayerState = {
  id: PlayerId;
  position: Vector3;
  rotation: Quaternion;
  color: string;
  isHost: boolean;
  nickname: string;
};

// Game state
export type GameState = {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  roomId: string | null;
  playerCount: number;

  // Local player
  localPlayerId: PlayerId | null;

  // All players in game (including local)
  players: Record<PlayerId, PlayerState>;

  // Networking
  peerManager: PeerManager | null;

  // Actions
  connect: (roomId: string, nickname?: string) => void;
  disconnect: () => void;
  updateLocalPlayerPosition: (position: Vector3) => void;
  updateLocalPlayerRotation: (rotation: Quaternion) => void;
};

// Create the store
export const useGameStore = create<GameState>((set, get) => {
  // Helper to update and broadcast player state
  const updateAndBroadcastPlayerState = (partialState: Partial<PlayerState>) => {
    const { localPlayerId, players, peerManager } = get();

    if (!localPlayerId || !peerManager) return;

    // Determine what actually changed to minimize broadcast data
    const currentState = players[localPlayerId];
    let changed = false;
    const updatedState: PlayerState = { ...currentState };

    // Check position change (with a small threshold to avoid tiny updates)
    if (partialState.position && !currentState.position.equals(partialState.position)) {
      updatedState.position.copy(partialState.position);
      changed = true;
    }

    // Check rotation change (with a small threshold)
    if (partialState.rotation && !currentState.rotation.equals(partialState.rotation)) {
      updatedState.rotation.copy(partialState.rotation);
      changed = true;
    }

    // Check other potential fields if added later (e.g., nickname, color)
    if (partialState.nickname && currentState.nickname !== partialState.nickname) {
      updatedState.nickname = partialState.nickname;
      changed = true;
    }
    // Add checks for other fields like color, isHost if they can change dynamically

    // Only update and broadcast if something actually changed
    if (changed) {
      const updatedPlayers = { ...players, [localPlayerId]: updatedState };
      set({ players: updatedPlayers });

      // Broadcast only the changed properties
      const broadcastPayload: Partial<PlayerState> = { id: localPlayerId };
      if (partialState.position) broadcastPayload.position = updatedState.position;
      if (partialState.rotation) broadcastPayload.rotation = updatedState.rotation;
      if (partialState.nickname) broadcastPayload.nickname = updatedState.nickname;
      // Add other changed fields to payload

      peerManager.broadcast('player_state_update', broadcastPayload);
    }
  };

  return {
    // Initial state
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    roomId: null,
    playerCount: 0,
    localPlayerId: null,
    players: {},
    peerManager: null,

    // Connect to a room
    connect: (roomId: string, nickname: string = 'Player') => {
      // Don't reconnect if already connected
      if (get().isConnected || get().isConnecting) return;

      set({ isConnecting: true, connectionError: null, roomId });

      const peerManager = new PeerManager();

      // Handle connection events
      peerManager.on('clientConnected', () => {
        const localPlayerId = peerManager.clientId;

        if (localPlayerId) {
          const localPlayer: PlayerState = {
            id: localPlayerId,
            position: new Vector3(0, 1, 0), // Spawn slightly above ground
            rotation: new Quaternion(),
            color: getRandomColor(),
            isHost: false, // Will be set to true if first in room
            nickname: nickname,
          };

          // *** Call createPlayerBody AFTER setting initial state ***
          // This ensures the store has the player before physics tries to use it
          import('@/systems/physics').then(({ createPlayerBody }) => {
            createPlayerBody(localPlayerId, localPlayer.position);
          });

          const players = { [localPlayerId]: localPlayer };

          set({
            isConnected: true,
            isConnecting: false,
            localPlayerId,
            players,
          });

          // Join the room
          peerManager.joinRoom(roomId);
        }
      });

      peerManager.on('clientDisconnected', () => {
        set({
          isConnected: false,
          isConnecting: false,
          connectionError: 'Disconnected from signaling server',
        });
      });

      // Handle room events
      peerManager.on('roomJoined', (roomId, userCount) => {
        const localPlayerId = get().localPlayerId;
        const players = get().players;

        if (localPlayerId && players[localPlayerId]) {
          set({
            roomId,
            playerCount: userCount,
            // If we're the only one, we're the host
            players:
              userCount === 1
                ? {
                    ...players,
                    [localPlayerId]: { ...players[localPlayerId], isHost: true },
                  }
                : players,
          });

          // Send our initial state to everyone
          const currentPeerManager = get().peerManager;
          if (currentPeerManager) {
            currentPeerManager.broadcast('player_state', players[localPlayerId]);
          }
        }
      });

      peerManager.on('roomLeft', () => {
        set({ roomId: null, playerCount: 0 });
      });

      // Handle peer events
      peerManager.on('peerConnect', (peerId) => {
        const localPlayerId = get().localPlayerId;
        const players = get().players;
        const currentPeerManager = get().peerManager;

        // Send our state to the new peer
        if (localPlayerId && players[localPlayerId] && currentPeerManager) {
          currentPeerManager.send(peerId, 'player_state', players[localPlayerId]);
        }
      });

      peerManager.on('peerDisconnect', (peerId) => {
        // Remove the player from our state
        const { players } = get();
        const updatedPlayers = { ...players };
        delete updatedPlayers[peerId];

        set({
          players: updatedPlayers,
          playerCount: Object.keys(updatedPlayers).length,
        });
      });

      // Handle data events
      peerManager.on('data', (peerId, data: PeerData) => {
        // Existing handler for full initial state
        if (data.type === 'player_state') {
          const playerState = data.payload as PlayerState;
          const { players } = get();
          const updatedPlayers = { ...players };
          const position = new Vector3();
          position.set(
            playerState.position.x || 0,
            playerState.position.y || 0,
            playerState.position.z || 0
          );
          const rotation = new Quaternion();
          rotation.set(
            playerState.rotation.x || 0,
            playerState.rotation.y || 0,
            playerState.rotation.z || 0,
            playerState.rotation.w || 1
          );
          updatedPlayers[peerId] = { ...playerState, position, rotation, id: peerId };
          set({ players: updatedPlayers });
        }

        // *** NEW: Handler for partial updates ***
        if (data.type === 'player_state_update') {
          const partialUpdate = data.payload as Partial<PlayerState>;
          const targetPlayerId = partialUpdate.id;

          if (targetPlayerId && targetPlayerId !== get().localPlayerId) {
            const { players } = get();
            const currentPlayerState = players[targetPlayerId];

            if (currentPlayerState) {
              const updatedPlayerState = { ...currentPlayerState };

              if (partialUpdate.position) {
                updatedPlayerState.position.set(
                  partialUpdate.position.x || 0,
                  partialUpdate.position.y || 0,
                  partialUpdate.position.z || 0
                );
              }
              if (partialUpdate.rotation) {
                updatedPlayerState.rotation.set(
                  partialUpdate.rotation.x || 0,
                  partialUpdate.rotation.y || 0,
                  partialUpdate.rotation.z || 0,
                  partialUpdate.rotation.w || 1
                );
              }
              if (partialUpdate.nickname) {
                updatedPlayerState.nickname = partialUpdate.nickname;
              }
              // Handle other partial fields

              const updatedPlayers = { ...players, [targetPlayerId]: updatedPlayerState };
              set({ players: updatedPlayers });
            }
          }
        }
      });

      // Connect to signaling server
      peerManager.connect();

      // Save peer manager
      set({ peerManager });
    },

    // Disconnect from the room
    disconnect: () => {
      const { peerManager } = get();

      if (peerManager) {
        peerManager.disconnect();
      }

      set({
        isConnected: false,
        isConnecting: false,
        roomId: null,
        localPlayerId: null,
        players: {},
        peerManager: null,
      });
    },

    // Update local player position
    updateLocalPlayerPosition: (position: Vector3) => {
      updateAndBroadcastPlayerState({ position });
    },

    // Update local player rotation
    updateLocalPlayerRotation: (rotation: Quaternion) => {
      updateAndBroadcastPlayerState({ rotation });
    },
  };
});

// Helper to generate a random color
function getRandomColor(): string {
  const colors = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33F5', // Pink
    '#F5FF33', // Yellow
    '#33FFF5', // Cyan
    '#FF5733', // Orange
    '#9333FF', // Purple
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

# Multiplayer Ball Physics Game

## Overview

A peer-to-peer multiplayer 3D game where players control colorful balls in a physics-based environment. Players connect directly using WebRTC technology and can move around, jump, and interact with the environment and each other.

## Technical Stack

- **Frontend**: React, Vite, TypeScript
- **3D Graphics**: Three.js, React Three Fiber
- **Physics**: Cannon.js
- **Networking**: WebRTC via simple-peer
- **Signaling**: Socket.io (for initial connection only)
- **UI Components**: shadcn/ui

## Key Features

### Multiplayer System

- WebRTC peer-to-peer connections for low-latency direct communication
- Socket.io backend for initial signaling and peer discovery
- Player state synchronization (position, velocity, nickname)
- Network optimization with throttled updates (100ms interval)
- Change detection to reduce bandwidth usage

### Player Controls

- Keyboard WASD movement with directional impulses
- Spacebar for jumping with cooldown
- Physics-based movement with appropriate damping and friction
- Customizable player nickname display

### Graphics and Environment

- 3D environment with dynamic lighting and shadows
- Ground plane with appropriate friction
- Decorative rock elements
- Smooth camera system that follows the local player
- Player ball color assignment based on connection ID

### Physics

- Full Cannon.js physics integration for realistic interactions
- Custom physics materials for proper friction and contact behavior
- Collision detection between players and environment
- Linear and angular damping for smooth motion
- Appropriate restitution (bounciness) for player balls

### User Interface

- Room-based connection system
- Nickname input and display
- Connection status indicators
- Clean, minimal design using shadcn/ui components

## Game States

1. **Disconnected**: Initial state, player can enter nickname and join/create room
2. **Connecting**: Establishing WebRTC connection via signaling server
3. **Connected**: Active gameplay with physics and multiplayer synchronization

## Code Structure

- `src/components/`: 3D scene components and player objects
- `src/hooks/`: Custom logic hooks for controls and camera
- `src/systems/`: Global systems like physics
- `src/stores/`: Global state management (game state, connections)
- `src/lib/networking/`: WebRTC and Socket.io connection logic
- `src/ui/`: User interface components

## Future Enhancements

- Game objectives and scoring system
- Additional physics objects and obstacles
- Power-ups and special abilities
- Improved physics optimization for larger player counts
- Chat system between connected players
- Custom player appearance options

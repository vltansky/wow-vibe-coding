import * as CANNON from 'cannon-es';
import { Vector3, Quaternion } from 'three';
import { useGameStore } from '@/stores/gameStore';

// Physics world settings
const FIXED_TIMESTEP = 1 / 60;
const MAX_SUBSTEPS = 10;

// Physics world
let world: CANNON.World | null = null;

// Player material - Define here to be shared with mapPhysics
let playerMaterial: CANNON.Material | null = null;

// Map of player IDs to physics bodies
const playerBodies: Record<string, CANNON.Body> = {};

// Ground body
let groundBody: CANNON.Body | null = null;

// Expose world for map physics
export function getPhysicsWorld(): CANNON.World | null {
  return world;
}

// Expose player material for map physics
export function getPlayerMaterial(): CANNON.Material | null {
  return playerMaterial;
}

// Initialize the physics world
export function initPhysics() {
  // Create world
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
    allowSleep: true, // Allow bodies to sleep for performance
  });

  // Set broadphase after world creation
  world.broadphase = new CANNON.SAPBroadphase(world);

  // Create player material
  playerMaterial = new CANNON.Material('playerMaterial');
  playerMaterial.friction = 0.2; // Slightly less friction
  playerMaterial.restitution = 0.4; // Less bounce than before

  // Create ground material
  const groundMaterial = new CANNON.Material('groundMaterial');
  groundMaterial.friction = 0.4;
  groundMaterial.restitution = 0.1;

  // Create ground
  const groundShape = new CANNON.Plane();
  groundBody = new CANNON.Body({
    mass: 0, // Static body
    type: CANNON.Body.STATIC,
    material: groundMaterial,
  });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Make it face up

  // Add ground to world
  world.addBody(groundBody);

  console.log('Physics world initialized');
}

// Create a physics body for a player
export function createPlayerBody(playerId: string, position: Vector3, radius: number = 0.5) {
  console.log(`Attempting to create physics body for player: ${playerId}`); // Log entry

  if (!world || !playerMaterial) {
    console.error(
      `Physics world or material not ready for player: ${playerId}. World: ${!!world}, Material: ${!!playerMaterial}`
    ); // Log error if not ready
    return null;
  }

  console.log(`Creating physics body for player: ${playerId} at`, position); // Log actual creation

  // Create sphere body using the shared player material
  const sphereShape = new CANNON.Sphere(radius);
  const sphereBody = new CANNON.Body({
    mass: 5, // Slightly increased mass
    shape: sphereShape,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    linearDamping: 0.4, // Decreased from 0.85 for faster movement
    angularDamping: 0.4, // Decreased from 0.85 for faster movement
    fixedRotation: false,
    material: playerMaterial,
  });

  // Add to world
  world.addBody(sphereBody);
  console.log(`Added physics body for player: ${playerId} to world.`); // Log addition

  // Store in player bodies map
  playerBodies[playerId] = sphereBody;

  // Define contact material between player and ground (if ground exists)
  // NOTE: This groundBody check might be unreliable now that map physics handles surfaces
  // We rely on mapPhysics.ts to set up player-surface contacts.
  // if (groundBody && groundBody.material) {
  //   const groundPlayerContactMaterial = new CANNON.ContactMaterial(
  //     groundBody.material,
  //     playerMaterial,
  //     {
  //       friction: 0.4,
  //       restitution: 0.3,
  //     }
  //   );
  //   world.addContactMaterial(groundPlayerContactMaterial);
  // }

  return sphereBody;
}

// Remove a player's physics body
export function removePlayerBody(playerId: string) {
  if (!world) return;

  const body = playerBodies[playerId];
  if (body) {
    world.removeBody(body);
    delete playerBodies[playerId];
  }
}

// Update physics
export function updatePhysics(deltaTime: number = 1 / 60) {
  if (!world) return;

  world.step(FIXED_TIMESTEP, deltaTime, MAX_SUBSTEPS);

  // Update all player meshes from physics bodies
  const gameState = useGameStore.getState();
  const updateLocalPlayerPosition = gameState.updateLocalPlayerPosition;
  const updateLocalPlayerRotation = gameState.updateLocalPlayerRotation;

  Object.entries(playerBodies).forEach(([playerId, body]) => {
    const position = new Vector3(body.position.x, body.position.y, body.position.z);
    const rotation = new Quaternion(
      body.quaternion.x,
      body.quaternion.y,
      body.quaternion.z,
      body.quaternion.w
    );

    if (playerId === gameState.localPlayerId) {
      // For local player, use store actions to update position/rotation
      // This will also broadcast to other players
      updateLocalPlayerPosition(position);
      updateLocalPlayerRotation(rotation);
    } else {
      // For remote players, update directly without broadcasting
      if (gameState.players[playerId]) {
        gameState.players[playerId].position.copy(position);
        gameState.players[playerId].rotation.copy(rotation);
      }
    }
  });
}

// Apply force to a player's body
export function applyForceToPlayer(playerId: string, force: Vector3) {
  const body = playerBodies[playerId];
  if (body) {
    body.applyForce(new CANNON.Vec3(force.x, force.y, force.z));
  }
}

// Apply impulse to a player's body
export function applyImpulseToPlayer(playerId: string, impulse: Vector3, worldPoint?: Vector3) {
  const body = playerBodies[playerId];
  if (body) {
    if (worldPoint) {
      body.applyImpulse(
        new CANNON.Vec3(impulse.x, impulse.y, impulse.z),
        new CANNON.Vec3(worldPoint.x, worldPoint.y, worldPoint.z)
      );
    } else {
      body.applyImpulse(new CANNON.Vec3(impulse.x, impulse.y, impulse.z));
    }
  }
}

// Set player body position directly
export function setPlayerBodyPosition(playerId: string, position: Vector3) {
  const body = playerBodies[playerId];
  if (body) {
    body.position.set(position.x, position.y, position.z);
    body.previousPosition.set(position.x, position.y, position.z);
    body.interpolatedPosition.set(position.x, position.y, position.z);
    body.initPosition.set(position.x, position.y, position.z);
  }
}

// Set player body velocity
export function setPlayerBodyVelocity(playerId: string, velocity: Vector3) {
  const body = playerBodies[playerId];
  if (body) {
    body.velocity.set(velocity.x, velocity.y, velocity.z);
    body.initVelocity.set(velocity.x, velocity.y, velocity.z);
  }
}

// Get player body position
export function getPlayerBodyPosition(playerId: string): Vector3 | null {
  const body = playerBodies[playerId];
  if (body) {
    return new Vector3(body.position.x, body.position.y, body.position.z);
  }
  return null;
}

// Get player body velocity
export function getPlayerBodyVelocity(playerId: string): Vector3 | null {
  const body = playerBodies[playerId];
  if (body) {
    return new Vector3(body.velocity.x, body.velocity.y, body.velocity.z);
  }
  return null;
}

// Get player body rotation
export function getPlayerBodyRotation(playerId: string): Quaternion | null {
  const body = playerBodies[playerId];
  if (body) {
    return new Quaternion(
      body.quaternion.x,
      body.quaternion.y,
      body.quaternion.z,
      body.quaternion.w
    );
  }
  return null;
}

// Clean up physics
export function cleanupPhysics() {
  if (world) {
    // Clean up map physics first
    import('./mapPhysics')
      .then(({ cleanupMapPhysics }) => {
        cleanupMapPhysics();
      })
      .catch((error) => {
        console.error('Failed to import mapPhysics for cleanup:', error);
      });

    // Remove all player bodies
    Object.values(playerBodies).forEach((body) => {
      world!.removeBody(body);
    });

    // Clear player bodies map
    Object.keys(playerBodies).forEach((key) => {
      delete playerBodies[key];
    });

    // Remove ground
    if (groundBody) {
      world.removeBody(groundBody);
      groundBody = null;
    }

    // Clear player material
    playerMaterial = null;

    // Null out world
    world = null;
  }
}

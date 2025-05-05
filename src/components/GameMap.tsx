import { useEffect, useRef } from 'react';
import { Box3, Vector3 } from 'three';
import { Box, Cylinder } from '@react-three/drei';

// Map dimensions
const MAP_SIZE = 30;
const WALL_HEIGHT = 2;
const WALL_THICKNESS = 1;

export function GameMap() {
  const mapRef = useRef<Box3>(
    new Box3(
      new Vector3(-MAP_SIZE / 2, 0, -MAP_SIZE / 2),
      new Vector3(MAP_SIZE / 2, WALL_HEIGHT, MAP_SIZE / 2)
    )
  );

  // Initialize map physics
  useEffect(() => {
    // Dynamically import to avoid circular dependencies
    import('@/systems/mapPhysics')
      .then(({ createMapPhysics }) => {
        // Create all physics bodies for the map
        createMapPhysics(mapRef.current);
      })
      .catch((error) => {
        console.error('Failed to import mapPhysics:', error);
      });

    // Return cleanup function
    return () => {
      // Cleanup happens in physics.ts
    };
  }, []);

  return (
    <group>
      {/* Ground plane with different surfaces */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[MAP_SIZE, MAP_SIZE]} />
        <meshStandardMaterial color="#1a6e1a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ice surface in the center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[MAP_SIZE / 3, MAP_SIZE / 3]} />
        <meshStandardMaterial color="#a8d8f0" roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Sticky surface on the sides */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[MAP_SIZE / 3, 0.01, 0]} receiveShadow>
        <planeGeometry args={[MAP_SIZE / 6, MAP_SIZE / 3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Boundary Walls */}
      {/* North Wall */}
      <Box
        position={[0, WALL_HEIGHT / 2, -MAP_SIZE / 2 - WALL_THICKNESS / 2]}
        args={[MAP_SIZE + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#555555" />
      </Box>

      {/* South Wall */}
      <Box
        position={[0, WALL_HEIGHT / 2, MAP_SIZE / 2 + WALL_THICKNESS / 2]}
        args={[MAP_SIZE + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#555555" />
      </Box>

      {/* East Wall */}
      <Box
        position={[MAP_SIZE / 2 + WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}
        args={[WALL_THICKNESS, WALL_HEIGHT, MAP_SIZE]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#555555" />
      </Box>

      {/* West Wall */}
      <Box
        position={[-MAP_SIZE / 2 - WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}
        args={[WALL_THICKNESS, WALL_HEIGHT, MAP_SIZE]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#555555" />
      </Box>

      {/* Ramp */}
      <Box
        position={[-MAP_SIZE / 4, 0.5, MAP_SIZE / 4]}
        rotation={[Math.PI / 12, 0, 0]}
        args={[MAP_SIZE / 6, 0.2, MAP_SIZE / 6]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#999999" />
      </Box>

      {/* Center platform */}
      <Cylinder position={[0, 0.3, 0]} args={[3, 3, 0.6, 32]} castShadow receiveShadow>
        <meshStandardMaterial color="#999999" />
      </Cylinder>

      {/* Obstacles */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const distance = MAP_SIZE / 3;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        return (
          <Box
            key={`obstacle-${i}`}
            position={[x, WALL_HEIGHT / 3, z]}
            args={[2, WALL_HEIGHT / 1.5, 2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#777777" />
          </Box>
        );
      })}
    </group>
  );
}

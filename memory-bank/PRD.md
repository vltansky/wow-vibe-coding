# TLV Escape: Game Product Requirements Document (PRD)

## 1. Executive Summary

TLV Escape is a casual, arcade-style game that takes players on a virtual tour of Tel Aviv neighborhoods through a collection of engaging minigames. Players select a character and navigate a map of Tel Aviv, visiting different neighborhoods to play unique minigames, collect items, and complete challenges, with the ultimate goal of exploring the entire city.

## 2. Product Overview

### 2.1 Game Concept

TLV Escape is an arcade-style game that blends exploration, collection, and quick reflex mechanics to create an engaging tour of Tel Aviv. Players navigate through a map of Tel Aviv, selecting neighborhoods to visit and complete minigames.

### 2.2 Core Game Loop

1. Select a character from five unique personalities
2. Navigate the Tel Aviv map
3. Select a neighborhood to visit
4. Travel to the neighborhood via bus transition animation
5. Complete the neighborhood-specific minigame
6. Return to the map to select the next neighborhood
7. Continue until all neighborhoods are completed or player runs out of hearts

### 2.3 Target Audience

- Casual gamers looking for quick, engaging play sessions
- Tourists or visitors interested in exploring Tel Aviv in a gamified way
- Tel Aviv residents who want to experience their city in a fun, digital format

## 3. Game Mechanics

### 3.1 Characters

Players can choose from five distinct characters, each with their own visual style:

- Nimrod
- Liat
- Reuven
- Josef
- Hila

### 3.2 Health System

- 5 hearts representing player health (always visible in the HUD)
- Hearts are lost when colliding with enemies in minigames
- Hearts can be restored by collecting hummus or falafel, up to a maximum of 5
- Game ends when all hearts are depleted
- Never display more than 5 hearts, and never show temporary or extra hearts

### 3.3 Map Navigation

- Interactive map of Tel Aviv with clickable neighborhoods
- Completed neighborhoods are visually distinct
- Selecting a neighborhood triggers a bus transition animation

### 3.4 Minigames

Each neighborhood features a unique minigame with:

- Themed enemies and collectibles relevant to the neighborhood
- Scrolling background representing the neighborhood
- Timed gameplay (default: 20 seconds)
- Score system based on collecting items and avoiding enemies
- Win condition: survive until time expires
- Loss condition: collide with too many enemies and lose all hearts

### 3.5 Collectibles

- Primary collectibles like hummus and falafel
- Point items that increase score
- Hearts that restore health

### 3.6 Minigame Difficulty Progression Mechanics

#### Difficulty Multiplier Table

| Completed Neighborhoods | Enemy Speed (px/s) | Enemy Spawn Interval (s) | Background Speed (px/s) | Player Speed (px/s) | Heart Spawn Interval (s) |
| ----------------------- | ------------------ | ------------------------ | ----------------------- | ------------------- | ------------------------ |
| 0                       | 100                | 2.0                      | 50                      | 200                 | 10                       |
| 1                       | 110                | 1.8                      | 55                      | 220                 | 10                       |
| 2                       | 120                | 1.6                      | 60                      | 240                 | 9                        |
| 3                       | 130                | 1.4                      | 65                      | 260                 | 9                        |
| 4+                      | 150                | 1.2                      | 75                      | 300                 | 8                        |

- Difficulty is based on the number of completed neighborhoods, not which ones.
- All minigames use this progression for enemy speed, spawn interval, background speed, player speed, and heart spawn interval.

#### Enemy Density and Variety

- 0–1 completed: Single enemy spawns (1 at a time).
- 2–3 completed: Waves of 2 enemies spawn simultaneously.
- 4+ completed: Waves of 3 enemies spawn simultaneously.
- Each minigame must have at least two enemy types with distinct behaviors (e.g., slow/straight, fast/zigzag).
- Enemy types are randomly selected per wave, weighted for balance (e.g., 60% slow, 40% fast).
- Cap max enemies on screen at 10.

#### Collectible Balance

- Primary collectibles: Spawn interval decreases with difficulty (see table above), max 3–4 per minigame.
- Point items: Spawn every 1 second, +10 points each, constant across all difficulties.

#### Standardization

- All minigames (Florentin, Old North, Tayelet, etc.) use the same difficulty progression, enemy wave, and collectible logic.
- Only assets and enemy/collectible types differ by neighborhood.

#### Technical Implementation Notes

- Difficulty parameters are calculated based on completedNeighborhoods.length in Zustand.
- Game engine applies these parameters to enemy spawning, movement, background speed, player speed, and collectible spawning.
- Enemy types and wave logic are defined in each minigame's configuration.
- Difficulty is updated after each completed minigame.
- Log difficulty and spawn events for debugging.
- Cap max enemies on screen to prevent overcrowding.

- The minigame ends immediately when the player reaches the target score (100 points), regardless of remaining time. The player is returned to the map.
- If the timer expires before reaching the target score, the minigame ends as usual.

### 3.7 Player Sprite Flipping Mechanics

- The player sprite is a static PNG, facing left by default.
- When the player moves right (mouse X increases), the sprite is flipped horizontally to face right.
- When the player moves left (mouse X decreases), the sprite faces left (default orientation).
- When idle (no movement), the sprite maintains the last facing direction.
- The game tracks `facingDirection: 'left' | 'right'` and `previousMouseX: number` in Zustand.
- On each mouse movement, the game compares the current X to previousMouseX and updates facingDirection accordingly.
- The canvas rendering loop uses `ctx.scale(-1, 1)` and position adjustment to flip the sprite when facing right, and draws normally when facing left.
- The hitbox and collision logic are unaffected by the visual flip.
- This mechanic is standardized across all minigames and works with all character sprites.

## 4. Features & Screens

### 4.1 Welcome Screen

- Character selection
- Game introduction
- Start game button

### 4.2 Map Screen

- Interactive Tel Aviv map using Leaflet
- Neighborhood boundaries with hover effects
- Tooltips displaying neighborhood names
- Visual indication of completed areas

### 4.3 Bus Transition

- Animation showing travel between neighborhoods
- Transitions from map to minigame

### 4.4 Minigame Screen

- Character controlled by mouse movement
- Descending enemies to avoid
- Collectibles to gather
- Score display
- Timer visualization
- Visual feedback for collisions

### 4.5 HUD (Heads-Up Display)

- Health/hearts display
- Score counter
- Timer
- Neighborhood name

### 4.6 Game Over Screen

- Final score
- Restart option

### 4.7 Victory Screen

- Congratulations message
- Final score
- Option to play again

## 5. Neighborhoods & Minigames

The following neighborhoods are implemented with corresponding minigames:

1. **Florentin**

   - Default minigame with street art-themed obstacles

2. **Old North**

   - Beach and cafe-themed minigame

3. **Tayelet (Promenade)**

   - Sea-themed minigame with beach elements

4. **Kerem HaTeimanim**

   - Food market-themed gameplay

5. **Park HaMesila**

   - Park and nature-themed elements

6. **Rothschild Boulevard**

   - Business and culture-themed challenges

7. **Neve Sha'anan**

   - Bus station and market elements

8. **Neve Tzedek**

   - Historic neighborhood theme

9. **Memadion**
   - Water park-themed obstacles

## 6. Technical Implementation

### 6.1 Core Technologies

- React for UI components and game structure
- TypeScript for type safety
- Zustand for state management
- HTML Canvas for game rendering
- Leaflet for map integration

### 6.2 State Management

- Game state (welcome, map, transition, minigame, gameover, victory)
- Character selection
- Neighborhood selection and completion tracking
- Health tracking (5 hearts only, no temporary or extra hearts)
- Collectible inventory
- Score system

### 6.3 Game Engine Components

- Canvas-based rendering
- Collision detection
- Player input handling
- Enemy and collectible spawning systems
- Animation framework
- Asset preloading

## 7. Future Enhancements

### 7.1 Additional Neighborhoods

- Add remaining Tel Aviv neighborhoods with unique minigames

### 7.2 Character Special Abilities

- Implement unique abilities for each character

### 7.3 Leaderboards

- Add persistent high score tracking

### 7.4 Achievement System

- Create unlockable achievements for gameplay milestones

### 7.5 Mobile Support

- Adapt controls and UI for mobile devices

## 8. Success Metrics

- Completion rate: % of players who complete all neighborhoods
- Retention: average number of play sessions per user
- Favorite neighborhoods: tracking which minigames are most frequently played
- Average score: tracking player performance
- Character popularity: tracking character selection rates

---

Document Version: 1.0
Last Updated: [Current Date]

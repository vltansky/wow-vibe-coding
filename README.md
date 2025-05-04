# Three.js React Hackathon Boilerplate

A modern boilerplate for building 3D web applications using React, Three.js, TypeScript, Vite, and shadcn/ui. This project provides a well-structured foundation for hackathons, game jams, or any creative 3D web project.

## 🚀 Features

- **React 18** with TypeScript
- **Three.js** integration via React Three Fiber
- **Cannon.js** for physics
- **Vite** for fast development and building
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for styling
- **ESLint** for code quality
- **Prettier** for consistent code formatting
- **Tailwind Class Sorter** for automatically organizing Tailwind classes

## 📦 Project Structure

```
src/
├── components/     # 3D scene components (<SceneCanvas />, <Player />, etc.)
│   └── ui/         # shadcn/ui primitives
├── hooks/          # Custom hooks (useControls, useFollowCamera, etc.)
├── systems/        # Global loop logic (physics, animation, AI)
├── stores/         # Global state management (Zustand/Jotai)
├── loaders/        # Asset loading logic
├── utils/          # Helpers and math utilities
├── ui/             # High-level UI components (menus, HUD)
├── shaders/        # Custom GLSL shaders
├── App.tsx         # Main app layout
└── main.tsx        # Vite entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vltansky/wow-vibe-coding.git
cd wow-vibe-coding

# Install dependencies
yarn
```

### Development

```bash
# Start dev server
yarn dev
```

### Build

```bash
# Build for production
yarn build
```

### Code Formatting

The project uses Prettier for consistent code formatting. Formatting will automatically be applied when you save files if you're using VSCode with the recommended extensions.

```bash
# Format all files
yarn format

# Check if files are formatted correctly
yarn format:check
```

#### Tailwind Class Sorting

Tailwind classes are automatically sorted using the official `prettier-plugin-tailwindcss` plugin. This ensures consistent class ordering across all files, which improves readability and maintainability.

The classes are sorted in the following logical order:

- Layout (position, display, etc.)
- Sizing (width, height)
- Spacing (margin, padding)
- Typography (font, text)
- Visual styling (colors, backgrounds)
- Interactive states (hover, focus)
- Responsive breakpoints (sm, md, lg)

## 🎮 Development Guidelines

### Three.js Best Practices

- Use **PascalCase** for Three.js classes
- Use **camelCase** for instances, variables, and functions
- Separate concerns (scene setup, asset loading, animations)
- Always clean up resources with `.dispose()`
- Use delta time for animations
- Optimize geometries, textures, and materials

### React Integration

- Use `useEffect` for Three.js setup/teardown
- Use `useRef` for stable references to Three.js objects
- Separate Three.js logic from React component rendering
- Use React state for UI-related states only

### Performance Tips

- Use InstancedMesh for multiple similar objects
- Share materials and geometries
- Implement object pooling for frequently created/destroyed objects
- Profile memory usage
- Implement adaptive quality based on performance

## 📚 Documentation

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)

# **Three.js Game Asset Resources**

## **2D Assets**

- **OpenGameArt** (Free): Pixel art, sprites, tilesets (PNG). Best for indie prototyping. [opengameart.org](https://opengameart.org/)
- **Itch.io** (Free/Paid, $5-$20): Pixel art, UI, tilesets (PNG). Stylized indie look. [itch.io](https://itch.io/)
- **Kenney** (Free/Donation): Sprites, UI (PNG). Rapid prototyping. [kenney.nl](https://kenney.nl/)
- **FLUX.1 (Hugging Face)** (Free/Paid): AI-generated textures (PNG). Free tier; paid via fal.ai/Replicate. Custom prototyping. [huggingface.co](https://huggingface.co/)
- **CraftPix.net** (Free/Paid, $5-$50): UI kits, sprites, effects (PNG). Clean UI focus. [craftpix.net](https://craftpix.net/)
- **Lospec** (Free): Pixel art palettes, tools (PNG). Stylized palette design. [lospec.com](https://lospec.com/)

## **3D Assets**

- **Trellis (Hugging Face)** (Free): AI-generated models (GLB) from FLUX.1 images. Rapid prototyping. [huggingface.co/spaces/JeffreyXiang/TRELLIS](https://huggingface.co/spaces/JeffreyXiang/TRELLIS)
- **Sketchfab** (Free/Paid, $10-$100): Models (GLTF/GLB). High-poly, realistic. [sketchfab.com](https://sketchfab.com/)
- **Poly Pizza** (Free): Low-poly models (GLTF). Stylized indie look. [poly.pizza](https://poly.pizza/)
- **Clara.io** (Free): Models, materials (GLTF). Simple prototyping. [clara.io](https://clara.io/)
- **CGTrader** (Free/Paid, $5-$50): Models (FBX, convert to GLTF). Realistic assets. [cgtrader.com](https://cgtrader.com/)
- **Mixamo** (Free): Rigged characters, animations (FBX, convert to GLTF via Blender plugin/FBX2GLTF). Animated prototyping. [mixamo.com](https://mixamo.com/)
- **Hunyuan 3D** (Free/Paid): AI-generated models (GLTF). Custom prototyping. [3d-models.hunyuan.tencent.com](https://3d-models.hunyuan.tencent.com/)
- **MeshyAI** (Free/Paid, \~$10/mo): AI-generated models (GLTF). Stylized prototyping. [meshy.ai](https://meshy.ai/)
- **Quaternius** (Free): Low-poly packs (GLTF/FBX). Stylized indie look. [quaternius.com](https://quaternius.com/)
- **Turbosquid** (Free/Paid, $10-$200): Models (FBX/GLTF). High-poly, realistic. [turbosquid.com](https://turbosquid.com/)
- **Google Poly Archive** (Free): Mirrored low-poly models (OBJ/GLTF). Basic prototyping. [poly.google.com](https://poly.google.com/)

## **Sound Assets**

- **Freesound** (Free): Effects, loops (WAV/MP3, some need attribution). General prototyping. [freesound.org](https://freesound.org/)
- **Zapsplat** (Free/Paid, $20-$60/yr): Effects, music (MP3/WAV). Game soundscapes. [zapsplat.com](https://zapsplat.com/)
- **Itch.io** (Free/Paid, $5-$15): Chiptune, effects (WAV/MP3). Retro indie look. [itch.io](https://itch.io/)
- **Kenney Audio** (Free/Donation): Effects, loops (WAV). Rapid prototyping. [kenney.nl](https://kenney.nl/)
- **ElevenLabs** (Free/Paid, \~$5/mo): AI-generated SoundFX (WAV/MP3). Custom effects. [elevenlabs.io](https://elevenlabs.io/)
- **SunoMusic** (Free/Paid, \~$10/mo): AI-generated music (MP3/WAV). Vibe-coded soundtracks. [suno.com](https://suno.com/)
- **Bfxr** (Free): Procedural retro sound FX (WAV). Retro prototyping. [bfxr.net](https://bfxr.net/)

## **Skybox Assets**

- **Blockade Labs** (Free/Paid, \~$10/mo): AI-generated 360° skyboxes (cube maps, PNG). Stylized environments. [skybox.blockadelabs.com](https://skybox.blockadelabs.com/)

## **Animation/Sprite Helpers**

- **Rive** (Free/Paid, \~$15/mo): Realtime 2D animations (SVG/canvas). Dynamic UI/prototyping. [rive.app](https://rive.app/)
- **Aseprite** (Paid, $20): Sprite sheets, pixel art animations (PNG). Stylized indie look. [aseprite.org](https://aseprite.org/)

## **Optimization & Conversion Tools**

- **Blender** (Free): Convert FBX/OBJ to GLTF, decimate models. Asset optimization. [blender.org](https://blender.org/)
- **glTF-Transform** (Free CLI): Compress/optimize GLTF files. Performance tuning. [gltf-transform.donmccurdy.com](https://gltf-transform.donmccurdy.com/)

## **Workflow Helpers**

- **Three.js Editor** (Free): Online scene editor. Rapid prototyping. [threejs.org/editor](https://threejs.org/editor)
- **Spline** (Free/Paid, \~$7/mo): 3D design with Three.js export (GLTF). Intuitive prototyping. [spline.design](https://spline.design/)

## **Notes**

- **Formats**: GLTF/GLB for 3D, WAV/MP3 for audio, PNG/SVG for 2D. Convert FBX/OBJ to GLTF via Blender/FBX2GLTF.
- **Vibe Coding**: Trellis, FLUX.1, MeshyAI, ElevenLabs, Suno, Blockade Labs enable AI-driven workflows.
- **Licensing**: Verify commercial use. Free tiers have limits; paid tiers offer quality/volume.
- **Community**: Three.js Discord, r/threejs for integration tips.

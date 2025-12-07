# Space Kontext - Architectural Design Platform

A web-based architectural design tool that combines geospatial data, 2D floorplan editing, automatic 3D generation, and sun analysis in a unified platform.

## Features

- **Site Analysis**: Real-world geospatial data integration with sun path, weather, topography, and context buildings
- **2D Floorplan Editor**: Professional floorplan drawing with intuitive tools, object library, and multi-floor support
- **3D Model Generation**: Automatic 3D generation from 2D floorplans with sun simulation and realistic shadows
- **Massing Diagrams**: Quick volumetric studies with primitive shapes and comprehensive analysis tools

## Target Platform

This application is designed primarily for **desktop and laptop use** where architects typically work. The interface is optimized for:
- Large screens (1280px+ width)
- Mouse and keyboard interaction
- Professional architectural workflows
- Multi-monitor setups

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Rendering**: Leaflet (maps), Fabric.js (2D), Three.js (3D)
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Cloudflare R2 / AWS S3
- **Authentication**: Clerk
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Cloudflare R2 or AWS S3 bucket

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd space-kontext
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

### Project Structure

```
src/
├── app/                    # Next.js app router
├── features/               # Feature-based modules
│   ├── site-analysis/     # Site analysis feature
│   ├── floorplan-2d/      # 2D floorplan editor
│   ├── model-3d/          # 3D model generation
│   └── massing/           # Massing diagrams
├── shared/                # Shared components and utilities
├── rendering-engines/     # Rendering engine wrappers
└── lib/                   # External integrations
```

### Architecture

The application follows a feature-based architecture where each major feature is self-contained with its own components, hooks, services, and state management. Shared code is kept minimal and only includes truly reusable components and utilities.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

import { PrismaClient } from '../src/lib/prisma/generated';

const prisma = new PrismaClient();

/**
 * Seed the database with initial data for development
 */
async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { clerkId: 'test_user_123' },
    update: {},
    create: {
      clerkId: 'test_user_123',
      email: 'test@spacekontext.com',
      firstName: 'Test',
      lastName: 'User',
      imageUrl: 'https://via.placeholder.com/150',
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create a sample project
  const sampleProject = await prisma.project.upsert({
    where: { id: 'sample_project_123' },
    update: {},
    create: {
      id: 'sample_project_123',
      name: 'Sample Architectural Project',
      description: 'A sample project to demonstrate the Space Kontext features',
      userId: testUser.id,
      settings: {
        units: 'metric',
        defaultFloorHeight: 3.0,
        gridSize: 0.5,
      },
    },
  });

  console.log('✅ Created sample project:', sampleProject.name);

  // Create sample site analysis
  await prisma.siteAnalysis.upsert({
    where: { projectId: sampleProject.id },
    update: {},
    create: {
      projectId: sampleProject.id,
      coordinates: {
        center: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
      },
      boundary: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-74.0065, 40.7125],
                [-74.0055, 40.7125],
                [-74.0055, 40.7131],
                [-74.0065, 40.7131],
                [-74.0065, 40.7125],
              ]],
            },
          },
        ],
      },
      sunPathData: {
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
        calculated: new Date().toISOString(),
      },
      weatherData: {
        averageTemperature: 15.5,
        averageHumidity: 65,
        windSpeed: 3.2,
        lastUpdated: new Date().toISOString(),
      },
    },
  });

  console.log('✅ Created sample site analysis');

  // Create sample floorplan
  await prisma.floorplan.upsert({
    where: { id: 'sample_floorplan_123' },
    update: {},
    create: {
      id: 'sample_floorplan_123',
      projectId: sampleProject.id,
      name: 'Ground Floor Plan',
      level: 0,
      data: {
        version: '1.0',
        objects: [
          {
            type: 'rect',
            left: 100,
            top: 100,
            width: 200,
            height: 150,
            fill: '#f0f0f0',
            stroke: '#333',
            strokeWidth: 2,
          },
          {
            type: 'rect',
            left: 150,
            top: 200,
            width: 100,
            height: 50,
            fill: '#e0e0e0',
            stroke: '#333',
            strokeWidth: 1,
          },
        ],
        background: '#ffffff',
        width: 800,
        height: 600,
      },
    },
  });

  console.log('✅ Created sample floorplan');

  // Create sample 3D model
  await prisma.model3D.upsert({
    where: { id: 'sample_model_123' },
    update: {},
    create: {
      id: 'sample_model_123',
      projectId: sampleProject.id,
      floorplanId: 'sample_floorplan_123',
      name: '3D Building Model',
      modelData: {
        version: '1.0',
        scene: {
          objects: [
            {
              type: 'BoxGeometry',
              width: 20,
              height: 10,
              depth: 15,
              position: { x: 0, y: 5, z: 0 },
              material: { color: '#cccccc' },
            },
          ],
          camera: {
            position: { x: 30, y: 20, z: 30 },
            lookAt: { x: 0, y: 0, z: 0 },
          },
          lighting: {
            ambient: { color: '#404040', intensity: 0.4 },
            directional: { color: '#ffffff', intensity: 0.8, position: { x: 10, y: 10, z: 5 } },
          },
        },
      },
      settings: {
        renderMode: 'realistic',
        shadows: true,
        antialias: true,
      },
    },
  });

  console.log('✅ Created sample 3D model');

  // Create sample massing
  await prisma.massing.upsert({
    where: { id: 'sample_massing_123' },
    update: {},
    create: {
      id: 'sample_massing_123',
      projectId: sampleProject.id,
      name: 'Building Massing Study',
      massingData: {
        version: '1.0',
        volumes: [
          {
            id: 'volume_1',
            type: 'box',
            dimensions: { width: 20, height: 10, depth: 15 },
            position: { x: 0, y: 0, z: 0 },
            material: { color: '#ff6b6b', opacity: 0.7 },
          },
          {
            id: 'volume_2',
            type: 'box',
            dimensions: { width: 15, height: 8, depth: 12 },
            position: { x: 25, y: 0, z: 0 },
            material: { color: '#4ecdc4', opacity: 0.7 },
          },
        ],
        site: {
          boundaries: {
            type: 'Polygon',
            coordinates: [[
              [-10, -10],
              [50, -10],
              [50, 20],
              [-10, 20],
              [-10, -10],
            ]],
          },
        },
      },
      analysis: {
        totalVolume: 4400,
        floorAreaRatio: 0.6,
        buildingHeight: 10,
        siteArea: 1800,
      },
    },
  });

  console.log('✅ Created sample massing');

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Sample data created:');
  console.log('   - Test user: test@spacekontext.com');
  console.log('   - Sample project: Sample Architectural Project');
  console.log('   - Site analysis with NYC coordinates');
  console.log('   - Ground floor plan with basic shapes');
  console.log('   - 3D building model');
  console.log('   - Building massing study');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

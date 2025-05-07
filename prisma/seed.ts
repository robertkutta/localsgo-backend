import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with test data...');

  // Create 5 itineraries in London
  const itineraries = [
    {
      name: 'Historic London Tour',
      description:
        "A journey through London's rich history and iconic landmarks",
      userId: 'user_2NNKqwRxDrfYeEBg3JdDBdW4gV2',
      latitude: 51.5074,
      longitude: -0.1278,
      tripTypes: ['leisure', 'cultural', 'family'],
      spots: [
        {
          name: 'Tower of London',
          description:
            'Historic castle and former prison on the north bank of the River Thames',
          latitude: 51.5081,
          longitude: -0.0759,
          placeId: 'ChIJ3TgfM0kDdkgRZ2TV4d1Jv6g',
          address: 'Tower Hill, London EC3N 4AB',
          price: '£29.90 for adults',
          category: 'cultural',
        },
        {
          name: 'The British Museum',
          description: 'World-famous museum of art and antiquities',
          latitude: 51.5194,
          longitude: -0.1269,
          placeId: 'ChIJB9OTMDIbdkgRp0JWbQGZsS8',
          address: 'Great Russell St, London WC1B 3DG',
          price: 'Free admission',
          category: 'cultural',
        },
        {
          name: "St. Paul's Cathedral",
          description: 'Anglican cathedral with a iconic dome and rich history',
          latitude: 51.5138,
          longitude: -0.0984,
          placeId: 'ChIJcXJZ9E4DdkgR5H47ObD7Ymg',
          address: "St. Paul's Churchyard, London EC4M 8AD",
          price: '£21 for adults',
          category: 'cultural',
        },
      ],
    },
    {
      name: 'London Foodie Adventure',
      description: "Explore London's diverse culinary scene and food markets",
      userId: 'user_2NNKqwRxDrfYeEBg3JdDBdW4gV2', // Replace with a valid Clerk user ID
      latitude: 51.5107,
      longitude: -0.0859,
      tripTypes: ['leisure', 'couples'],
      spots: [
        {
          name: 'Borough Market',
          description: "One of London's oldest and most renowned food markets",
          latitude: 51.5055,
          longitude: -0.091,
          placeId: 'ChIJa8JAeLwEdkgRb-Ls9lFnwwM',
          address: '8 Southwark St, London SE1 1TL',
          price: 'Free entry, food prices vary',
          category: 'restaurant',
        },
        {
          name: 'Dishoom Shoreditch',
          description: 'Popular Bombay-style café serving Indian cuisine',
          latitude: 51.5243,
          longitude: -0.078,
          placeId: 'ChIJJ9zBLrocdkgR2RnXd1XGi3g',
          address: '7 Boundary St, London E2 7JE',
          price: '££-£££',
          category: 'restaurant',
        },
        {
          name: 'Duck & Waffle',
          description: '24/7 upscale restaurant with panoramic views of London',
          latitude: 51.5161,
          longitude: -0.0817,
          placeId: 'ChIJcXnGUVQDdkgR1FJ8WAyYF5s',
          address: '110 Bishopsgate, London EC2N 4AY',
          price: '£££',
          category: 'restaurant',
        },
      ],
    },
    {
      name: 'London Parks & Gardens',
      description: "Discover London's beautiful green spaces and parks",
      userId: 'user_2NNKqwRxDrfYeEBg3JdDBdW4gV2', // Replace with a valid Clerk user ID
      latitude: 51.5073,
      longitude: -0.1657,
      tripTypes: ['leisure', 'active', 'family'],
      spots: [
        {
          name: 'Hyde Park',
          description: "One of London's largest and most famous royal parks",
          latitude: 51.5073,
          longitude: -0.1657,
          placeId: 'ChIJhRoYKUkFdkgRDL20SX5oPjI',
          address: 'Hyde Park, London W2 2UH',
          price: 'Free entry',
          category: 'outdoor',
        },
        {
          name: 'Kew Gardens',
          description:
            'Royal Botanic Gardens with the largest collection of living plants in the world',
          latitude: 51.4787,
          longitude: -0.2956,
          placeId: 'ChIJTTKkPUcPdkgRFBY5q2qRYNc',
          address: 'Richmond TW9 3AE',
          price: '£19.50 for adults',
          category: 'outdoor',
        },
        {
          name: 'Primrose Hill',
          description: 'Hill with panoramic views of London skyline',
          latitude: 51.5387,
          longitude: -0.1606,
          placeId: 'ChIJlXbecMUadkgRCJ25SHBLi1A',
          address: 'Primrose Hill, London NW1 4NR',
          price: 'Free entry',
          category: 'outdoor',
        },
      ],
    },
    {
      name: 'London Coffee Tour',
      description: 'Visit the best specialty coffee shops in London',
      userId: 'user_2NNKqwRxDrfYeEBg3JdDBdW4gV2', // Replace with a valid Clerk user ID
      latitude: 51.5228,
      longitude: -0.0818,
      tripTypes: ['leisure'],
      spots: [
        {
          name: 'Monmouth Coffee',
          description:
            'Iconic London coffee shop known for its single-origin beans',
          latitude: 51.5139,
          longitude: -0.0821,
          placeId: 'ChIJV6qqhckEdkgRsXYbvQWKP0c',
          address: '27 Monmouth St, London WC2H 9EU',
          price: '£-££',
          category: 'coffee',
        },
        {
          name: 'Ozone Coffee Roasters',
          description: 'Specialty coffee roaster and café in Shoreditch',
          latitude: 51.5261,
          longitude: -0.0878,
          placeId: 'ChIJrzO0BbgcdkgRDeLH4Xb-TlU',
          address: '11 Leonard St, London EC2A 4AQ',
          price: '££',
          category: 'coffee',
        },
        {
          name: 'Grind',
          description: 'Trendy café and cocktail bar in Shoreditch',
          latitude: 51.5228,
          longitude: -0.0818,
          placeId: 'ChIJkcxiebgcdkgRfKZVR6fIxuQ',
          address: '213 Old St, London EC1V 9NR',
          price: '££',
          category: 'coffee',
        },
      ],
    },
    {
      name: 'London Shopping Trip',
      description: "Explore London's best shopping districts and iconic stores",
      userId: 'user_2NNKqwRxDrfYeEBg3JdDBdW4gV2', // Replace with a valid Clerk user ID
      latitude: 51.513,
      longitude: -0.1591,
      tripTypes: ['leisure', 'couples'],
      spots: [
        {
          name: 'Oxford Street',
          description: "Europe's busiest shopping street with flagship stores",
          latitude: 51.515,
          longitude: -0.1417,
          placeId: 'ChIJ2ScUVscadkgRrlwB8yU65t0',
          address: 'Oxford St, London',
          price: 'Free to browse, £-£££ for shopping',
          category: 'shopping',
        },
        {
          name: 'Harrods',
          description: 'Luxury department store in Knightsbridge',
          latitude: 51.4994,
          longitude: -0.1632,
          placeId: 'ChIJUbDwgskFdkgRZ2U63RLen7c',
          address: '87-135 Brompton Rd, London SW1X 7XL',
          price: '£££',
          category: 'shopping',
        },
        {
          name: 'Covent Garden Market',
          description: "Shopping and entertainment hub in London's West End",
          latitude: 51.5117,
          longitude: -0.123,
          placeId: 'ChIJdQmEhM4EdkgRDwsWCOQQIg8',
          address: 'Covent Garden, London WC2E 8RF',
          price: 'Free to browse, £-£££ for shopping',
          category: 'shopping',
        },
      ],
    },
  ];

  console.log('Creating 5 itineraries with spots...');

  // Create each itinerary and its spots
  for (const itineraryData of itineraries) {
    const { spots, ...itineraryInfo } = itineraryData;

    // Extract categories from spots
    const derivedCategories = [
      ...new Set(spots.map((spot) => spot.category).filter(Boolean)),
    ];

    // Create the itinerary
    const itinerary = await prisma.itinerary.create({
      data: {
        ...itineraryInfo,
        derivedCategories,
        // Don't include spots here as we'll create them separately
      },
    });

    console.log(`Created itinerary: ${itinerary.name} (ID: ${itinerary.id})`);

    // Create the spots for this itinerary
    for (const spotData of spots) {
      const spot = await prisma.spot.create({
        data: {
          ...spotData,
          itineraryId: itinerary.id,
        },
      });
      console.log(`  - Added spot: ${spot.name}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

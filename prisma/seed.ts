import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const productData = [
  {
    name: "Classic Cotton T-Shirt",
    description: "100% cotton, pre-shrunk, comfortable fit. Perfect for custom designs.",
    basePrice: 19.99,
    category: "Apparel",
    subcategory: "T-Shirts",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Gray", "Red", "Royal Blue"],
    tags: ["cotton", "basic", "unisex", "comfort"],
    printableAreas: [
      {
        id: "front-center",
        name: "Front Center",
        maxWidth: 12,
        maxHeight: 16,
        position: { x: 50, y: 35 }
      },
      {
        id: "back-center", 
        name: "Back Center",
        maxWidth: 12,
        maxHeight: 16,
        position: { x: 50, y: 35 }
      },
      {
        id: "left-chest",
        name: "Left Chest",
        maxWidth: 4,
        maxHeight: 4,
        position: { x: 25, y: 20 }
      }
    ],
    specifications: {
      material: "100% Cotton",
      weight: "5.3 oz",
      fit: "Regular",
      care: "Machine wash cold, tumble dry low"
    }
  },
  {
    name: "Premium Hoodie",
    description: "Cozy pullover hoodie with kangaroo pocket. Perfect for custom graphics.",
    basePrice: 39.99,
    category: "Apparel",
    subcategory: "Hoodies",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy", "Maroon", "Forest Green"],
    tags: ["hoodie", "warm", "comfortable", "casual"],
    printableAreas: [
      {
        id: "front-center",
        name: "Front Center",
        maxWidth: 10,
        maxHeight: 12,
        position: { x: 50, y: 40 }
      },
      {
        id: "back-center",
        name: "Back Center", 
        maxWidth: 12,
        maxHeight: 16,
        position: { x: 50, y: 35 }
      },
      {
        id: "hood",
        name: "Hood",
        maxWidth: 6,
        maxHeight: 6,
        position: { x: 50, y: 15 }
      },
      {
        id: "left-sleeve",
        name: "Left Sleeve",
        maxWidth: 4,
        maxHeight: 8,
        position: { x: 15, y: 45 }
      },
      {
        id: "right-sleeve",
        name: "Right Sleeve",
        maxWidth: 4,
        maxHeight: 8,
        position: { x: 85, y: 45 }
      }
    ],
    specifications: {
      material: "50% Cotton, 50% Polyester",
      weight: "8.0 oz",
      fit: "Relaxed",
      care: "Machine wash cold, tumble dry low"
    }
  },
  {
    name: "Ceramic Coffee Mug",
    description: "11oz ceramic mug with comfortable handle. Dishwasher and microwave safe.",
    basePrice: 12.99,
    category: "Drinkware", 
    subcategory: "Mugs",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500"
    ],
    sizes: ["11oz"],
    colors: ["White", "Black", "Red", "Blue", "Green"],
    tags: ["ceramic", "coffee", "dishwasher-safe", "microwave-safe"],
    printableAreas: [
      {
        id: "front",
        name: "Front Side",
        maxWidth: 8,
        maxHeight: 4,
        position: { x: 50, y: 50 }
      },
      {
        id: "back",
        name: "Back Side",
        maxWidth: 8,
        maxHeight: 4,
        position: { x: 50, y: 50 }
      },
      {
        id: "wrap-around",
        name: "Wrap Around",
        maxWidth: 16,
        maxHeight: 4,
        position: { x: 50, y: 50 }
      }
    ],
    specifications: {
      material: "Ceramic",
      capacity: "11 fl oz",
      dimensions: "3.75\" x 3.75\" x 4.5\"",
      care: "Dishwasher and microwave safe"
    }
  },
  {
    name: "Canvas Tote Bag",
    description: "Durable canvas tote bag with long handles. Perfect for custom artwork.",
    basePrice: 16.99,
    category: "Accessories",
    subcategory: "Bags",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1565695946088-d6d3e6eeada7?w=500"
    ],
    sizes: ["One Size"],
    colors: ["Natural", "Black", "Navy", "Red"],
    tags: ["canvas", "eco-friendly", "reusable", "durable"],
    printableAreas: [
      {
        id: "front-center",
        name: "Front Center",
        maxWidth: 10,
        maxHeight: 10,
        position: { x: 50, y: 45 }
      },
      {
        id: "back-center",
        name: "Back Center",
        maxWidth: 10,
        maxHeight: 10,
        position: { x: 50, y: 45 }
      }
    ],
    specifications: {
      material: "100% Cotton Canvas",
      weight: "10 oz",
      dimensions: "15\" x 16\" x 3\"",
      handles: "24\" long handles"
    }
  },
  {
    name: "Baseball Cap",
    description: "Classic six-panel baseball cap with adjustable strap.",
    basePrice: 22.99,
    category: "Accessories",
    subcategory: "Hats",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500"
    ],
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Red", "White", "Gray"],
    tags: ["baseball", "adjustable", "casual", "sport"],
    printableAreas: [
      {
        id: "front-center",
        name: "Front Center",
        maxWidth: 4,
        maxHeight: 3,
        position: { x: 50, y: 40 }
      },
      {
        id: "side-left",
        name: "Left Side",
        maxWidth: 3,
        maxHeight: 2,
        position: { x: 25, y: 45 }
      },
      {
        id: "side-right",
        name: "Right Side",
        maxWidth: 3,
        maxHeight: 2,
        position: { x: 75, y: 45 }
      }
    ],
    specifications: {
      material: "100% Cotton Twill",
      style: "Structured 6-panel",
      closure: "Adjustable snapback",
      visor: "Pre-curved"
    }
  }
];

const designData = [
  {
    name: "Vintage Sunset",
    description: "Beautiful retro sunset design with palm trees silhouette",
    price: 5.99,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
    tags: ["vintage", "sunset", "retro", "nature", "tropical"],
    category: "Nature",
    style: "Vintage",
    colors: ["Orange", "Pink", "Purple", "Yellow"],
    isPremium: false,
    rating: 4.8,
    downloads: 1247,
    fileFormats: ["PNG", "SVG", "PDF"],
    dimensions: { width: 3000, height: 3000 },
    license: "Commercial Use"
  },
  {
    name: "Minimalist Mountain",
    description: "Clean, minimalist mountain range silhouette",
    price: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1464822759844-d150baec43a4?w=500",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759844-d150baec43a4?w=200",
    tags: ["minimalist", "mountain", "nature", "clean", "simple"],
    category: "Nature",
    style: "Minimalist",
    colors: ["Black", "White", "Gray"],
    isPremium: false,
    rating: 4.6,
    downloads: 892,
    fileFormats: ["PNG", "SVG"],
    dimensions: { width: 2500, height: 1500 },
    license: "Commercial Use"
  },
  {
    name: "Urban Graffiti Style",
    description: "Bold graffiti-inspired design with urban elements",
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500",
    thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200",
    tags: ["graffiti", "urban", "street-art", "bold", "colorful"],
    category: "Street Art",
    style: "Graffiti",
    colors: ["Multi-color", "Neon", "Black", "White"],
    isPremium: true,
    rating: 4.9,
    downloads: 2156,
    fileFormats: ["PNG", "SVG", "PDF", "AI"],
    dimensions: { width: 4000, height: 4000 },
    license: "Extended Commercial Use"
  },
  {
    name: "Geometric Pattern",
    description: "Modern geometric pattern with clean lines",
    price: 3.99,
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500",
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200",
    tags: ["geometric", "pattern", "modern", "abstract", "clean"],
    category: "Abstract",
    style: "Modern",
    colors: ["Black", "White", "Gold", "Blue"],
    isPremium: false,
    rating: 4.4,
    downloads: 567,
    fileFormats: ["PNG", "SVG"],
    dimensions: { width: 2000, height: 2000 },
    license: "Commercial Use"
  },
  {
    name: "Motivational Quote",
    description: "Inspiring typography design with motivational message",
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1516975496598-b4e4f885ae16?w=500",
    thumbnailUrl: "https://images.unsplash.com/photo-1516975496598-b4e4f885ae16?w=200",
    tags: ["typography", "quote", "motivational", "text", "inspiring"],
    category: "Typography",
    style: "Modern",
    colors: ["Black", "White", "Gold", "Blue"],
    isPremium: false,
    rating: 4.7,
    downloads: 1891,
    fileFormats: ["PNG", "SVG", "PDF"],
    dimensions: { width: 3000, height: 2000 },
    license: "Commercial Use"
  },
  {
    name: "Cosmic Galaxy",
    description: "Stunning galaxy design with stars and nebula",
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500",
    thumbnailUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200",
    tags: ["galaxy", "space", "cosmic", "stars", "nebula"],
    category: "Space",
    style: "Realistic",
    colors: ["Purple", "Blue", "Pink", "Black", "White"],
    isPremium: true,
    rating: 4.9,
    downloads: 3421,
    fileFormats: ["PNG", "SVG", "PDF", "AI"],
    dimensions: { width: 5000, height: 5000 },
    license: "Extended Commercial Use"
  }
];

const categoryData = [
  {
    name: "Nature",
    slug: "nature",
    description: "Designs inspired by the natural world",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300",
    sortOrder: 1
  },
  {
    name: "Abstract",
    slug: "abstract", 
    description: "Modern abstract and geometric designs",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300",
    sortOrder: 2
  },
  {
    name: "Typography",
    slug: "typography",
    description: "Text-based and quote designs",
    image: "https://images.unsplash.com/photo-1516975496598-b4e4f885ae16?w=300",
    sortOrder: 3
  },
  {
    name: "Street Art",
    slug: "street-art",
    description: "Urban and graffiti-inspired designs",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
    sortOrder: 4
  },
  {
    name: "Space",
    slug: "space",
    description: "Cosmic and astronomy themed designs",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300",
    sortOrder: 5
  }
];

async function createUser(email: string, name: string, role: any = 'CUSTOMER') {
  return prisma.user.create({
    data: {
      email,
      name,
      role,
      isEmailVerified: true,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    }
  });
}

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.review.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.messageThread.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.design.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✨ Creating users...');
    // Create users
    const adminUser = await createUser('admin@printstore.com', 'Admin User', 'ADMIN');
    const designerUser = await createUser('designer@printstore.com', 'Creative Designer', 'DESIGNER');
    const customerUser = await createUser('customer@printstore.com', 'John Customer', 'CUSTOMER');
    const customerUser2 = await createUser('jane@example.com', 'Jane Smith', 'CUSTOMER');

    console.log('📂 Creating categories...');
    // Create categories
    const categories = await Promise.all(
      categoryData.map(cat => prisma.category.create({ data: cat }))
    );

    console.log('🎨 Creating designs...');
    // Create designs
    const designs = await Promise.all(
      designData.map(design => 
        prisma.design.create({
          data: {
            ...design,
            creatorId: designerUser.id
          }
        })
      )
    );

    console.log('📦 Creating products...');
    // Create products
    const products = await Promise.all(
      productData.map(product => prisma.product.create({ data: product }))
    );

    console.log('📝 Creating sample orders...');
    // Create sample order
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerId: customerUser.id,
        status: 'CONFIRMED',
        totalAmount: 32.98,
        subtotal: 29.98,
        tax: 2.40,
        shipping: 0.60,
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'USA'
        },
        billingAddress: {
          street: '123 Main St', 
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'USA'
        },
        paymentStatus: 'COMPLETED',
        paymentMethod: 'Credit Card',
        items: {
          create: [
            {
              productId: products[0].id,
              designId: designs[0].id,
              quantity: 1,
              unitPrice: 19.99,
              totalPrice: 19.99,
              size: 'M',
              color: 'Black',
              customization: {
                placement: 'front-center',
                size: 'medium',
                designInstructions: 'Place design in center of shirt'
              },
              productionStatus: 'DESIGNING'
            },
            {
              productId: products[1].id,
              designId: designs[2].id,
              quantity: 1,
              unitPrice: 9.99,
              totalPrice: 9.99,
              size: 'L',
              color: 'White',
              customization: {
                placement: 'front-center',
                size: 'large'
              },
              productionStatus: 'PENDING'
            }
          ]
        }
      },
      include: {
        items: true
      }
    });

    console.log('💬 Creating message threads...');
    // Create message thread
    const messageThread = await prisma.messageThread.create({
      data: {
        subject: 'Custom Design Request',
        customerId: customerUser.id,
        designerId: designerUser.id,
        orderId: sampleOrder.id,
        productId: products[0].id,
        designId: designs[0].id,
        status: 'ACTIVE',
        priority: 'NORMAL',
        designInstructions: {
          placement: 'front-center',
          size: 'medium',
          colors: ['black', 'white'],
          style: 'vintage',
          mood: 'retro',
          customNotes: 'Please make it look vintage and cool'
        },
        lastMessageAt: new Date(),
        messages: {
          create: [
            {
              senderId: customerUser.id,
              content: 'Hi! I\'d like to customize this design for my t-shirt. Can you help me make it look more vintage?',
              messageType: 'TEXT'
            },
            {
              senderId: designerUser.id,
              content: 'Absolutely! I can add some vintage effects and adjust the colors. Let me work on that for you.',
              messageType: 'TEXT'
            }
          ]
        }
      },
      include: {
        messages: true
      }
    });

    console.log('🛒 Creating cart items...');
    // Create cart items
    await prisma.cartItem.createMany({
      data: [
        {
          customerId: customerUser2.id,
          productId: products[2].id,
          designId: designs[1].id,
          quantity: 2,
          size: '11oz',
          color: 'White',
          customization: {
            placement: 'front',
            size: 'medium'
          }
        },
        {
          customerId: customerUser2.id,
          productId: products[3].id,
          designId: designs[3].id,
          quantity: 1,
          size: 'One Size',
          color: 'Natural'
        }
      ]
    });

    console.log('⭐ Creating reviews...');
    // Create reviews
    await prisma.review.createMany({
      data: [
        {
          customerId: customerUser.id,
          productId: products[0].id,
          designId: designs[0].id,
          rating: 5,
          comment: 'Amazing quality! The design looks exactly as I wanted.',
          isApproved: true,
          isHelpful: 12
        },
        {
          customerId: customerUser2.id,
          productId: products[1].id,
          rating: 4,
          comment: 'Great hoodie, very comfortable and good print quality.',
          isApproved: true,
          isHelpful: 8
        },
        {
          customerId: customerUser.id,
          designId: designs[2].id,
          rating: 5,
          comment: 'Love this design! Perfect for my project.',
          isApproved: true,
          isHelpful: 15
        }
      ]
    });

    console.log('🔔 Creating notifications...');
    // Create notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: customerUser.id,
          type: 'ORDER',
          title: 'Order Confirmed',
          message: 'Your order #ORD-123456 has been confirmed and is being processed.'
        },
        {
          userId: customerUser.id,
          type: 'DESIGN',
          title: 'Design Update',
          message: 'Your designer has updated your custom design. Please review.'
        },
        {
          userId: designerUser.id,
          type: 'CHAT',
          title: 'New Message',
          message: 'You have a new message from a customer about their design.'
        }
      ]
    });

    console.log('📊 Creating analytics data...');
    // Create some analytics data
    await prisma.analytics.createMany({
      data: [
        {
          event: 'page_view',
          data: { page: '/products', userAgent: 'Mozilla/5.0...' },
          userId: customerUser.id,
          sessionId: 'session_123',
          ipAddress: '192.168.1.1'
        },
        {
          event: 'design_view',
          data: { designId: designs[0].id, category: 'Nature' },
          userId: customerUser2.id,
          sessionId: 'session_456'
        },
        {
          event: 'add_to_cart',
          data: { productId: products[0].id, designId: designs[0].id },
          userId: customerUser.id,
          sessionId: 'session_123'
        }
      ]
    });

    console.log('✅ Database seeded successfully!');
    console.log(`
📊 Summary:
- Users: ${await prisma.user.count()}
- Products: ${await prisma.product.count()}
- Designs: ${await prisma.design.count()}
- Categories: ${await prisma.category.count()}
- Orders: ${await prisma.order.count()}
- Message Threads: ${await prisma.messageThread.count()}
- Reviews: ${await prisma.review.count()}
- Cart Items: ${await prisma.cartItem.count()}
- Notifications: ${await prisma.notification.count()}
- Analytics Events: ${await prisma.analytics.count()}
    `);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  await seed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
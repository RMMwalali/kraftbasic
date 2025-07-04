import { Product, Design, Creator, Category } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    description: 'Premium 100% cotton t-shirt perfect for custom designs. Soft, comfortable, and durable.',
    basePrice: 19.99,
    category: 'tshirts',
    images: [
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    colors: ['white', 'black', 'navy', 'red', 'gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    mockups: [
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isCustomizable: true,
    rating: 4.8,
    reviewCount: 234,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    description: 'Cozy fleece hoodie with kangaroo pocket. Perfect for cool weather and custom designs.',
    basePrice: 39.99,
    category: 'hoodies',
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    colors: ['black', 'gray', 'navy', 'burgundy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mockups: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isCustomizable: true,
    rating: 4.9,
    reviewCount: 156,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Ceramic Coffee Mug',
    description: '11oz ceramic mug perfect for morning coffee. Dishwasher and microwave safe.',
    basePrice: 14.99,
    category: 'mugs',
    images: [
      'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    colors: ['white', 'black', 'blue'],
    sizes: ['11oz'],
    mockups: [
      'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isCustomizable: true,
    rating: 4.7,
    reviewCount: 89,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Canvas Tote Bag',
    description: 'Eco-friendly canvas tote bag for everyday use. Strong handles and spacious interior.',
    basePrice: 16.99,
    category: 'bags',
    images: [
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    colors: ['natural', 'black', 'navy'],
    sizes: ['One Size'],
    mockups: [
      'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isCustomizable: true,
    rating: 4.6,
    reviewCount: 67,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    name: 'Vintage Poster Print',
    description: 'High-quality poster print on premium paper. Perfect for wall art and decoration.',
    basePrice: 12.99,
    category: 'posters',
    images: [
      'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    colors: ['white'],
    sizes: ['8x10', '11x14', '16x20', '18x24'],
    mockups: [
      'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isCustomizable: true,
    rating: 4.5,
    reviewCount: 123,
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '6',
    name: 'Vinyl Sticker Pack',
    description: 'Waterproof vinyl stickers perfect for laptops, water bottles, and more.',
    basePrice: 8.99,
    category: 'stickers',
    images: [
      'https://images.pexels.com/photos/4464207/pexels-photo-4464207.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    colors: ['white', 'transparent'],
    sizes: ['2x2', '3x3', '4x4'],
    mockups: [
      'https://images.pexels.com/photos/4464207/pexels-photo-4464207.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isCustomizable: true,
    rating: 4.4,
    reviewCount: 234,
    createdAt: new Date('2024-02-10'),
  },
];

export const mockDesigns: Design[] = [
  {
    id: '1',
    name: 'Minimalist Mountain',
    creatorId: '1',
    creatorName: 'Sarah Chen',
    productId: '1',
    imageUrl: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 24.99,
    tags: ['nature', 'minimalist', 'mountain'],
    isPublic: true,
    sales: 145,
    rating: 4.8,
    createdAt: new Date('2024-01-10'),
    description: 'A beautiful minimalist mountain design perfect for nature lovers.',
  },
  {
    id: '2',
    name: 'Retro Sunset',
    creatorId: '2',
    creatorName: 'Mike Johnson',
    productId: '1',
    imageUrl: 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 22.99,
    tags: ['retro', 'sunset', 'vintage'],
    isPublic: true,
    sales: 89,
    rating: 4.6,
    createdAt: new Date('2024-01-12'),
    description: 'Vintage-inspired sunset design with retro color palette.',
  },
  {
    id: '3',
    name: 'Abstract Geometry',
    creatorId: '1',
    creatorName: 'Sarah Chen',
    productId: '2',
    imageUrl: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 29.99,
    tags: ['abstract', 'geometry', 'modern'],
    isPublic: true,
    sales: 67,
    rating: 4.7,
    createdAt: new Date('2024-01-18'),
    description: 'Modern abstract geometric pattern with bold colors.',
  },
  {
    id: '4',
    name: 'Coffee Lover',
    creatorId: '2',
    creatorName: 'Mike Johnson',
    productId: '3',
    imageUrl: 'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 18.99,
    tags: ['coffee', 'typography', 'lifestyle'],
    isPublic: true,
    sales: 234,
    rating: 4.9,
    createdAt: new Date('2024-01-22'),
    description: 'Perfect design for coffee enthusiasts with stylish typography.',
  },
  {
    id: '5',
    name: 'Eco Warrior',
    creatorId: '1',
    creatorName: 'Sarah Chen',
    productId: '4',
    imageUrl: 'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 21.99,
    tags: ['eco', 'environment', 'green'],
    isPublic: true,
    sales: 156,
    rating: 4.8,
    createdAt: new Date('2024-01-28'),
    description: 'Environmental awareness design for eco-conscious individuals.',
  },
  {
    id: '6',
    name: 'Space Explorer',
    creatorId: '2',
    creatorName: 'Mike Johnson',
    productId: '5',
    imageUrl: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 16.99,
    tags: ['space', 'astronomy', 'science'],
    isPublic: true,
    sales: 98,
    rating: 4.5,
    createdAt: new Date('2024-02-03'),
    description: 'Cosmic design featuring planets and stars for space enthusiasts.',
  },
];

export const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Digital artist specializing in minimalist designs and nature themes. Creating beautiful, clean designs for over 5 years.',
    designs: mockDesigns.filter(d => d.creatorId === '1'),
    followers: 1234,
    totalSales: 2456,
    rating: 4.8,
    joinedAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Retro and vintage design enthusiast with 10+ years experience. Love creating nostalgic designs that tell a story.',
    designs: mockDesigns.filter(d => d.creatorId === '2'),
    followers: 987,
    totalSales: 1789,
    rating: 4.6,
    joinedAt: new Date('2023-08-20'),
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Illustrator and graphic designer focused on colorful, playful designs that bring joy to everyday items.',
    designs: [],
    followers: 756,
    totalSales: 1234,
    rating: 4.7,
    joinedAt: new Date('2023-09-10'),
  },
  {
    id: '4',
    name: 'Alex Kim',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Typography specialist and brand designer. Creating clean, professional designs for businesses and individuals.',
    designs: [],
    followers: 1456,
    totalSales: 3421,
    rating: 4.9,
    joinedAt: new Date('2023-05-22'),
  },
];

export const mockCategories: Category[] = [
  { id: 'tshirts', name: 'T-Shirts', icon: '👕', productCount: 156 },
  { id: 'hoodies', name: 'Hoodies', icon: '🧥', productCount: 89 },
  { id: 'mugs', name: 'Mugs', icon: '☕', productCount: 67 },
  { id: 'bags', name: 'Bags', icon: '👜', productCount: 45 },
  { id: 'posters', name: 'Posters', icon: '🖼️', productCount: 123 },
  { id: 'stickers', name: 'Stickers', icon: '🏷️', productCount: 234 },
];
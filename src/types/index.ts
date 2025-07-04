export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'designer' | 'admin';
  createdAt: Date;
  isVerified: boolean;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      behance?: string;
    };
  };
  stats?: {
    totalOrders?: number;
    totalSpent?: number;
    totalDesigns?: number;
    totalSales?: number;
    totalEarnings?: number;
    followers?: number;
    rating?: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  mockups: string[];
  isCustomizable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface Design {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  productId: string;
  imageUrl: string;
  price: number;
  tags: string[];
  isPublic: boolean;
  sales: number;
  rating: number;
  createdAt: Date;
  description: string;
  status?: 'draft' | 'published' | 'rejected';
}

export interface CartItem {
  id: string;
  productId: string;
  designId?: string;
  quantity: number;
  size: string;
  color: string;
  customization?: {
    text?: string;
    image?: string;
    position?: { x: number; y: number };
    designId?: string;
    customDesignUrl?: string;
    isCustomDesign?: boolean;
  };
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  designerId?: string;
  depositPaid: number;
  remainingAmount: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  designs: Design[];
  followers: number;
  totalSales: number;
  rating: number;
  joinedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface Analytics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  users: {
    total: number;
    customers: number;
    designers: number;
    newThisMonth: number;
  };
  products: {
    total: number;
    published: number;
    draft: number;
    topSelling: Product[];
  };
}
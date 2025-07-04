import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

// Types for our database operations
export interface DatabaseConfig {
  enableOfflineMode: boolean;
  syncInterval: number; // in milliseconds
  maxRetries: number;
}

export interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

class DatabaseService {
  private config: DatabaseConfig;
  private syncQueue: SyncQueueItem[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(config: DatabaseConfig = {
    enableOfflineMode: true,
    syncInterval: 30000, // 30 seconds
    maxRetries: 3
  }) {
    this.config = config;
    this.initializeOfflineSupport();
    this.startSyncProcess();
  }

  private initializeOfflineSupport() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Load sync queue from localStorage
    const storedQueue = localStorage.getItem('db_sync_queue');
    if (storedQueue) {
      this.syncQueue = JSON.parse(storedQueue);
    }
  }

  private startSyncProcess() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    }, this.config.syncInterval);
  }

  private async processSyncQueue() {
    const itemsToProcess = [...this.syncQueue];
    
    for (const item of itemsToProcess) {
      try {
        await this.executeSyncItem(item);
        this.removeSyncItem(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        item.retryCount++;
        
        if (item.retryCount >= this.config.maxRetries) {
          this.removeSyncItem(item.id);
          console.error('Max retries reached for sync item:', item);
        }
      }
    }

    this.saveSyncQueueToStorage();
  }

  private async executeSyncItem(item: SyncQueueItem) {
    switch (item.table) {
      case 'users':
        return this.syncUser(item);
      case 'products':
        return this.syncProduct(item);
      case 'designs':
        return this.syncDesign(item);
      case 'orders':
        return this.syncOrder(item);
      case 'cart_items':
        return this.syncCartItem(item);
      case 'message_threads':
        return this.syncMessageThread(item);
      case 'notifications':
        return this.syncNotification(item);
      default:
        throw new Error(`Unknown table: ${item.table}`);
    }
  }

  private addToSyncQueue(operation: SyncQueueItem['operation'], table: string, data: any) {
    if (!this.config.enableOfflineMode) return;

    const item: SyncQueueItem = {
      id: `${table}_${operation}_${Date.now()}_${Math.random()}`,
      operation,
      table,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.syncQueue.push(item);
    this.saveSyncQueueToStorage();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  private removeSyncItem(id: string) {
    this.syncQueue = this.syncQueue.filter(item => item.id !== id);
  }

  private saveSyncQueueToStorage() {
    localStorage.setItem('db_sync_queue', JSON.stringify(this.syncQueue));
  }

  // User operations
  async createUser(userData: any) {
    try {
      if (this.isOnline) {
        const user = await prisma.user.create({ data: userData });
        this.saveToLocalStorage('users', user.id, user);
        return user;
      } else {
        // Save to localStorage and add to sync queue
        const tempId = `temp_${Date.now()}`;
        const user = { ...userData, id: tempId };
        this.saveToLocalStorage('users', tempId, user);
        this.addToSyncQueue('create', 'users', userData);
        return user;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(id: string) {
    try {
      if (this.isOnline) {
        const user = await prisma.user.findUnique({ 
          where: { id },
          include: {
            orders: true,
            designs: true,
            messageThreads: true,
            cartItems: {
              include: {
                product: true,
                design: true
              }
            },
            notifications: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        });
        if (user) {
          this.saveToLocalStorage('users', id, user);
        }
        return user;
      } else {
        return this.getFromLocalStorage('users', id);
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return this.getFromLocalStorage('users', id);
    }
  }

  async updateUser(id: string, userData: any) {
    try {
      if (this.isOnline) {
        const user = await prisma.user.update({
          where: { id },
          data: userData
        });
        this.saveToLocalStorage('users', id, user);
        return user;
      } else {
        const existing = this.getFromLocalStorage('users', id) || {};
        const updated = { ...existing, ...userData };
        this.saveToLocalStorage('users', id, updated);
        this.addToSyncQueue('update', 'users', { id, ...userData });
        return updated;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Product operations
  async getProducts(filters: any = {}) {
    try {
      if (this.isOnline) {
        const products = await prisma.product.findMany({
          where: {
            isActive: true,
            ...filters
          },
          include: {
            reviews: {
              select: {
                rating: true,
                comment: true,
                customer: {
                  select: {
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        this.saveToLocalStorage('products_list', 'all', products);
        return products;
      } else {
        return this.getFromLocalStorage('products_list', 'all') || [];
      }
    } catch (error) {
      console.error('Error getting products:', error);
      return this.getFromLocalStorage('products_list', 'all') || [];
    }
  }

  async getProduct(id: string) {
    try {
      if (this.isOnline) {
        const product = await prisma.product.findUnique({
          where: { id },
          include: {
            reviews: {
              include: {
                customer: {
                  select: {
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          }
        });
        if (product) {
          this.saveToLocalStorage('products', id, product);
        }
        return product;
      } else {
        return this.getFromLocalStorage('products', id);
      }
    } catch (error) {
      console.error('Error getting product:', error);
      return this.getFromLocalStorage('products', id);
    }
  }

  // Design operations
  async getDesigns(filters: any = {}) {
    try {
      if (this.isOnline) {
        const designs = await prisma.design.findMany({
          where: {
            isActive: true,
            ...filters
          },
          include: {
            creator: {
              select: {
                name: true,
                avatar: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        this.saveToLocalStorage('designs_list', 'all', designs);
        return designs;
      } else {
        return this.getFromLocalStorage('designs_list', 'all') || [];
      }
    } catch (error) {
      console.error('Error getting designs:', error);
      return this.getFromLocalStorage('designs_list', 'all') || [];
    }
  }

  async getDesign(id: string) {
    try {
      if (this.isOnline) {
        const design = await prisma.design.findUnique({
          where: { id },
          include: {
            creator: true,
            reviews: {
              include: {
                customer: {
                  select: {
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          }
        });
        if (design) {
          this.saveToLocalStorage('designs', id, design);
        }
        return design;
      } else {
        return this.getFromLocalStorage('designs', id);
      }
    } catch (error) {
      console.error('Error getting design:', error);
      return this.getFromLocalStorage('designs', id);
    }
  }

  // Order operations
  async createOrder(orderData: any) {
    try {
      if (this.isOnline) {
        const order = await prisma.order.create({
          data: {
            ...orderData,
            orderNumber: `ORD-${Date.now()}`
          },
          include: {
            items: {
              include: {
                product: true,
                design: true
              }
            }
          }
        });
        this.saveToLocalStorage('orders', order.id, order);
        return order;
      } else {
        const tempId = `temp_${Date.now()}`;
        const order = {
          ...orderData,
          id: tempId,
          orderNumber: `ORD-${Date.now()}`
        };
        this.saveToLocalStorage('orders', tempId, order);
        this.addToSyncQueue('create', 'orders', orderData);
        return order;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string) {
    try {
      if (this.isOnline) {
        const orders = await prisma.order.findMany({
          where: { customerId: userId },
          include: {
            items: {
              include: {
                product: true,
                design: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        this.saveToLocalStorage('user_orders', userId, orders);
        return orders;
      } else {
        return this.getFromLocalStorage('user_orders', userId) || [];
      }
    } catch (error) {
      console.error('Error getting user orders:', error);
      return this.getFromLocalStorage('user_orders', userId) || [];
    }
  }

  // Cart operations
  async getCartItems(userId: string) {
    try {
      if (this.isOnline) {
        const cartItems = await prisma.cartItem.findMany({
          where: { customerId: userId },
          include: {
            product: true,
            design: true
          }
        });
        this.saveToLocalStorage('cart', userId, cartItems);
        return cartItems;
      } else {
        return this.getFromLocalStorage('cart', userId) || [];
      }
    } catch (error) {
      console.error('Error getting cart items:', error);
      return this.getFromLocalStorage('cart', userId) || [];
    }
  }

  async addToCart(cartData: any) {
    try {
      if (this.isOnline) {
        const cartItem = await prisma.cartItem.upsert({
          where: {
            customerId_productId_designId_size_color: {
              customerId: cartData.customerId,
              productId: cartData.productId,
              designId: cartData.designId || '',
              size: cartData.size || '',
              color: cartData.color || ''
            }
          },
          update: {
            quantity: { increment: cartData.quantity || 1 }
          },
          create: cartData,
          include: {
            product: true,
            design: true
          }
        });
        
        // Update local storage
        const cartItems = this.getFromLocalStorage('cart', cartData.customerId) || [];
        const updatedCart = cartItems.filter(item => item.id !== cartItem.id);
        updatedCart.push(cartItem);
        this.saveToLocalStorage('cart', cartData.customerId, updatedCart);
        
        return cartItem;
      } else {
        const cartItems = this.getFromLocalStorage('cart', cartData.customerId) || [];
        const tempId = `temp_${Date.now()}`;
        const cartItem = { ...cartData, id: tempId };
        cartItems.push(cartItem);
        this.saveToLocalStorage('cart', cartData.customerId, cartItems);
        this.addToSyncQueue('create', 'cart_items', cartData);
        return cartItem;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Message Thread operations
  async createMessageThread(threadData: any) {
    try {
      if (this.isOnline) {
        const thread = await prisma.messageThread.create({
          data: threadData,
          include: {
            customer: true,
            product: true,
            design: true,
            messages: true
          }
        });
        this.saveToLocalStorage('message_threads', thread.id, thread);
        return thread;
      } else {
        const tempId = `temp_${Date.now()}`;
        const thread = { ...threadData, id: tempId };
        this.saveToLocalStorage('message_threads', tempId, thread);
        this.addToSyncQueue('create', 'message_threads', threadData);
        return thread;
      }
    } catch (error) {
      console.error('Error creating message thread:', error);
      throw error;
    }
  }

  // Notification operations
  async getUserNotifications(userId: string) {
    try {
      if (this.isOnline) {
        const notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 50
        });
        this.saveToLocalStorage('notifications', userId, notifications);
        return notifications;
      } else {
        return this.getFromLocalStorage('notifications', userId) || [];
      }
    } catch (error) {
      console.error('Error getting notifications:', error);
      return this.getFromLocalStorage('notifications', userId) || [];
    }
  }

  // Sync operations for offline queue
  private async syncUser(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.user.create({ data: item.data });
      case 'update':
        return prisma.user.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.user.delete({ where: { id: item.data.id } });
    }
  }

  private async syncProduct(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.product.create({ data: item.data });
      case 'update':
        return prisma.product.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.product.delete({ where: { id: item.data.id } });
    }
  }

  private async syncDesign(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.design.create({ data: item.data });
      case 'update':
        return prisma.design.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.design.delete({ where: { id: item.data.id } });
    }
  }

  private async syncOrder(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.order.create({ data: item.data });
      case 'update':
        return prisma.order.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.order.delete({ where: { id: item.data.id } });
    }
  }

  private async syncCartItem(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.cartItem.create({ data: item.data });
      case 'update':
        return prisma.cartItem.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.cartItem.delete({ where: { id: item.data.id } });
    }
  }

  private async syncMessageThread(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.messageThread.create({ data: item.data });
      case 'update':
        return prisma.messageThread.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.messageThread.delete({ where: { id: item.data.id } });
    }
  }

  private async syncNotification(item: SyncQueueItem) {
    switch (item.operation) {
      case 'create':
        return prisma.notification.create({ data: item.data });
      case 'update':
        return prisma.notification.update({
          where: { id: item.data.id },
          data: item.data
        });
      case 'delete':
        return prisma.notification.delete({ where: { id: item.data.id } });
    }
  }

  // Local storage helpers
  private saveToLocalStorage(type: string, key: string, data: any) {
    try {
      const storageKey = `db_${type}_${key}`;
      const serialized = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: 1
      });
      localStorage.setItem(storageKey, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getFromLocalStorage(type: string, key: string) {
    try {
      const storageKey = `db_${type}_${key}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  // Cleanup methods
  clearLocalStorage() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('db_')) {
        localStorage.removeItem(key);
      }
    });
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

// Export singleton instance
export const db = new DatabaseService();
export default db;
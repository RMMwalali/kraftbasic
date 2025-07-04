import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, CartItem, Product, Design } from '../types';

interface Notification {
  id: string;
  type: 'chat' | 'order' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DesignInstructions {
  placement: string;
  size: string;
  colors: string[];
  customNotes: string;
  style: string;
  mood: string;
}

interface MessageThread {
  id: string;
  productId: string;
  designId: string;
  customerId: string;
  designerId?: string;
  message: string;
  instructions: DesignInstructions;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface UserFlowState {
  selectedProduct: Product | null;
  selectedDesign: Design | null;
  designInstructions: DesignInstructions | null;
  currentStep: 'home' | 'product-selection' | 'design-selection' | 'design-suit' | 'summary' | 'checkout';
  messageThread: MessageThread | null;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  products: Product[];
  designs: Design[];
  notifications: Notification[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  userFlow: UserFlowState;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; updates: Partial<CartItem> } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_DESIGNS'; payload: Design[] }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_FLOW_STEP'; payload: UserFlowState['currentStep'] }
  | { type: 'SELECT_PRODUCT'; payload: Product }
  | { type: 'SELECT_DESIGN'; payload: Design }
  | { type: 'SET_DESIGN_INSTRUCTIONS'; payload: DesignInstructions }
  | { type: 'CREATE_MESSAGE_THREAD'; payload: Omit<MessageThread, 'id' | 'timestamp'> }
  | { type: 'RESET_USER_FLOW' };

const initialState: AppState = {
  user: null,
  cart: [],
  products: [],
  designs: [],
  notifications: [],
  isLoading: false,
  searchQuery: '',
  selectedCategory: 'all',
  userFlow: {
    selectedProduct: null,
    selectedDesign: null,
    designInstructions: null,
    currentStep: 'home',
    messageThread: null,
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_DESIGNS':
      return { ...state, designs: action.payload };
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        read: false,
      };
      return { 
        ...state, 
        notifications: [newNotification, ...state.notifications.slice(0, 9)] // Keep only 10 most recent
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_FLOW_STEP':
      return { 
        ...state, 
        userFlow: { ...state.userFlow, currentStep: action.payload } 
      };
    case 'SELECT_PRODUCT':
      return {
        ...state,
        userFlow: {
          ...state.userFlow,
          selectedProduct: action.payload,
          currentStep: state.userFlow.selectedDesign ? 'design-suit' : 'design-selection'
        }
      };
    case 'SELECT_DESIGN':
      return {
        ...state,
        userFlow: {
          ...state.userFlow,
          selectedDesign: action.payload,
          currentStep: state.userFlow.selectedProduct ? 'design-suit' : 'product-selection'
        }
      };
    case 'SET_DESIGN_INSTRUCTIONS':
      return {
        ...state,
        userFlow: {
          ...state.userFlow,
          designInstructions: action.payload,
          currentStep: 'summary'
        }
      };
    case 'CREATE_MESSAGE_THREAD':
      const messageThread: MessageThread = {
        ...action.payload,
        id: `thread-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        userFlow: {
          ...state.userFlow,
          messageThread,
          currentStep: 'checkout'
        }
      };
    case 'RESET_USER_FLOW':
      return {
        ...state,
        userFlow: {
          selectedProduct: null,
          selectedDesign: null,
          designInstructions: null,
          currentStep: 'home',
          messageThread: null,
        }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export types for use in other components
export type { DesignInstructions, MessageThread, UserFlowState };
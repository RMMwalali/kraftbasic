import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Bell, Menu, X, User, LogOut, Settings, X as CloseIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { CartSlideout } from '../cart/CartSlideout';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { SearchResults } from '../search/SearchResults';
import { LoginModal } from '../auth/LoginModal';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockProducts } from '../../data/mockData';

export function Header() {
  const { state, dispatch } = useApp();
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasShaken, setHasShaken] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Add effect to handle click outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add shake animation for first minute
  useEffect(() => {
    if (!hasShaken) {
      const timer = setTimeout(() => {
        setHasShaken(true);
      }, 60000); // Stop shaking after 1 minute
      return () => clearTimeout(timer);
    }
  }, [hasShaken]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Memoized values to prevent unnecessary re-renders
  const cartItemCount = useMemo(() => 
    state.cart.reduce((sum, item) => sum + item.quantity, 0), 
    [state.cart]
  );
  
  const unreadNotifications = useMemo(() => 
    state.notifications.filter(n => !n.read).length, 
    [state.notifications]
  );

  // Stable navigation items
  const navigationItems = useMemo(() => [
    { name: 'Products', href: '/products' },
    { name: 'Designs', href: '/designs' },
    { name: 'Creators', href: '/creators' },
    { name: 'Custom Design', href: '/design' },
  ], []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (state.searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(state.searchQuery)}`);
      setShowSearchResults(false);
    }
  }, [state.searchQuery, navigate]);

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSearchResults(true);
  }, []);

  const handleSearchInputChange = useCallback((value: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: value });
    performSearch(value);
  }, [dispatch, performSearch]);

  const closeSearch = useCallback(() => {
    setShowSearchResults(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const getDashboardRoute = useCallback(() => {
    if (!authState.user) return '/';
    return `/dashboard/${authState.user.role}`;
  }, [authState.user]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs md:text-sm">P</span>
                </div>
                <span className="text-lg md:text-xl font-bold text-gray-900">PrintCraft</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="relative mx-4" ref={searchRef}>
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 40, opacity: 0.8 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 40, opacity: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative overflow-hidden"
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        placeholder="Search products or designs..."
                        value={state.searchQuery}
                        onChange={(e) => {
                          dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
                          setShowSearchResults(true);
                        }}
                        className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none text-sm transition-all duration-200"
                        autoFocus
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      {(state.searchQuery || isSearchOpen) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (state.searchQuery) {
                              dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
                            } else {
                              setIsSearchOpen(false);
                            }
                          }}
                          className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </form>
                  </motion.div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={!hasShaken ? {
                      rotate: [0, -5, 5, -5, 0],
                      transition: { 
                        repeat: 5, 
                        duration: 1.5,
                        ease: "easeInOut"
                      }
                    } : {}}
                  >
                    <Search className="h-5 w-5 text-gray-600" />
                  </motion.button>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
                  >
                    <SearchResults 
                      results={searchResults} 
                      query={state.searchQuery}
                      onClose={() => setShowSearchResults(false)} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Search Toggle */}
              <button
                onClick={toggleSearch}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleNotifications}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-white/50 backdrop-blur-sm"
              >
                <Bell className="h-5 w-5 md:h-6 md:w-6" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium shadow-lg"
                  >
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-white/50 backdrop-blur-sm"
              >
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium shadow-lg"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Menu */}
              {authState.isAuthenticated && authState.user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all"
                  >
                    <img
                      src={authState.user.avatar}
                      alt={authState.user.name}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-white/50"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {authState.user.name}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 py-2"
                    >
                      <Link
                        to={getDashboardRoute()}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    glassmorphic
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    glassmorphic
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-white/20"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products, designs..."
                  value={state.searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
            </motion.div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 border-t border-white/20 bg-white/80 backdrop-blur-md rounded-b-lg"
            >
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 rounded-lg hover:bg-white/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {authState.isAuthenticated && authState.user ? (
                  <div className="pt-4 border-t border-white/20 space-y-2">
                    <Link
                      to={getDashboardRoute()}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 rounded-lg hover:bg-white/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:bg-red-50 transition-colors px-2 py-1 rounded-lg w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      glassmorphic
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm" 
                      glassmorphic
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Cart Slideout */}
      <CartSlideout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Notifications Panel */}
      <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
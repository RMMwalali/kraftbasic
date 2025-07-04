import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'designer' | 'admin';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { state } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated || !state.user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && state.user.role !== requiredRole) {
    // Redirect based on user's actual role
    const dashboardRoutes = {
      customer: '/dashboard/customer',
      designer: '/dashboard/designer',
      admin: '/dashboard/admin',
    };
    
    return <Navigate to={dashboardRoutes[state.user.role]} replace />;
  }

  return <>{children}</>;
}
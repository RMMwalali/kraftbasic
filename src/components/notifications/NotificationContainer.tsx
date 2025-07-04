import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { NotificationToast } from './NotificationToast';
import { useApp } from '../../context/AppContext';

export function NotificationContainer() {
  const { state, dispatch } = useApp();

  const handleCloseNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {state.notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            {...notification}
            onClose={handleCloseNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
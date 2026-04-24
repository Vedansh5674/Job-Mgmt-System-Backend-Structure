import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

// Note: In a real app, this would be your backend URL
const SOCKET_URL = 'http://localhost:5000';

const WebSocketManager = () => {
  const { user, addNotification } = useStore();

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      auth: { token: user.token }
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Join a room with the user's ID to receive targeted notifications
      socket.emit('join_user_room', user._id || user.id);
    });

    socket.on('notification', (data) => {
      console.log('Notification received:', data);
      if (addNotification) {
        addNotification({
          id: Date.now(),
          message: data.message,
          type: data.type || 'info',
          title: data.title,
          timestamp: new Date()
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null; // This component doesn't render anything
};

export default WebSocketManager;

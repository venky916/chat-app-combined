import { createContext, useContext } from 'react';

import io from 'socket.io-client';
const ENDPOINT = import.meta.env.VITE_ENDPOINT;
const SocketContext = createContext({ socket: null });
const socket = io(ENDPOINT);

const SocketProvider = ({ children }) => {
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

// Custom hook for accessing the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketProvider;

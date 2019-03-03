import socketIOClient from 'socket.io-client';

const SocketService = () => {
  // eslint-disable-next-line no-unused-vars
  const startSocketListeners = endpoint => {
    const socket = socketIOClient(endpoint);
    socket.on('change color', col => {});
  };
};

export default SocketService;

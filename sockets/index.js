const initializeSocket= (io) => {
  let onlineUsers = [];

  io.on('connection', (socket) => {
    socket.on('addNewUser', (userId) => {
      const userIndex = onlineUsers.findIndex((user) => user.userId === userId);

      if (userIndex === -1) {
        onlineUsers.push({ userId, socketId: socket.id });
      } else {
        onlineUsers[userIndex].socketId = socket.id;
      }
      io.emit('getOnlineUsers', onlineUsers);
    });

    socket.on('logout', () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit('getOnlineUsers', onlineUsers);
    });

    socket.on('sendMessage', (message) => {
      const user = onlineUsers.find(
        (user) => user.userId === message.recipientId
      );
      if (user) {
        io.to(user.socketId).emit('getMessage', message.message);
        io.to(user.socketId).emit('getNotification', {
          senderId: message.message.sender_id,
          isRead: false,
          date: new Date(),
        });
      }
    });
    socket.on('createChat', (chat) => {
        const user = onlineUsers.find(
          (user) => user.userId === chat.recipient_id
        );
        if (user) {
          io.to(user.socketId).emit('getNewChat', {sender_id:chat.sender_id, recipient_id:chat.recipient_id});
        }
      });
  });
};

export default initializeSocket;
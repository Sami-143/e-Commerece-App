const Chat = require("../model/chatModel");

const socketHandler = (io) => {
  // Store connected users and admins
  const connectedUsers = new Map(); // { oderId: socket.id }
  const connectedAdmins = new Set(); // Set of admin socket.ids

  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // User joins their chat room
    socket.on("join_chat", (userId) => {
      socket.join(`user_${userId}`);
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} joined chat`);
    });

    // Admin joins admin room
    socket.on("admin_join", () => {
      socket.join("admin_room");
      connectedAdmins.add(socket.id);
      console.log("Admin joined:", socket.id);
    });

    // Admin joins specific chat
    socket.on("admin_join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Admin joined chat room: ${chatId}`);
    });

    // User sends message
    socket.on("user_message", async (data) => {
      try {
        const { userId, message, chatId } = data;

        let chat;
        if (chatId) {
          chat = await Chat.findById(chatId);
        } else {
          chat = await Chat.findOne({ user: userId, status: "active" });
        }

        if (chat) {
          const newMessage = {
            sender: "user",
            message,
            timestamp: new Date(),
            read: false,
          };

          chat.messages.push(newMessage);
          await chat.save();

          // Emit to all admins
          io.to("admin_room").emit("new_message", {
            chatId: chat._id,
            message: newMessage,
            userName: chat.userName,
            userEmail: chat.userEmail,
          });

          // Emit back to user
          socket.emit("message_sent", {
            chatId: chat._id,
            message: newMessage,
          });
        }
      } catch (error) {
        console.error("Error sending user message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Admin sends message
    socket.on("admin_message", async (data) => {
      try {
        const { chatId, message } = data;

        const chat = await Chat.findById(chatId);

        if (chat) {
          const newMessage = {
            sender: "admin",
            message,
            timestamp: new Date(),
            read: true,
          };

          chat.messages.push(newMessage);
          await chat.save();

          // Emit to user
          io.to(`user_${chat.user}`).emit("admin_reply", {
            chatId: chat._id,
            message: newMessage,
          });

          // Emit to all admins in this chat
          io.to(`chat_${chatId}`).emit("message_sent", {
            chatId: chat._id,
            message: newMessage,
          });

          // Notify other admins
          io.to("admin_room").emit("chat_updated", {
            chatId: chat._id,
          });
        }
      } catch (error) {
        console.error("Error sending admin message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark messages as read
    socket.on("mark_read", async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat) {
          chat.messages.forEach((msg) => {
            if (msg.sender === "user") {
              msg.read = true;
            }
          });
          await chat.save();
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Typing indicators
    socket.on("typing_start", (data) => {
      if (data.isAdmin) {
        io.to(`user_${data.userId}`).emit("admin_typing", true);
      } else {
        io.to("admin_room").emit("user_typing", {
          chatId: data.chatId,
          typing: true,
        });
      }
    });

    socket.on("typing_stop", (data) => {
      if (data.isAdmin) {
        io.to(`user_${data.userId}`).emit("admin_typing", false);
      } else {
        io.to("admin_room").emit("user_typing", {
          chatId: data.chatId,
          typing: false,
        });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Remove from connected users
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
      connectedAdmins.delete(socket.id);
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;

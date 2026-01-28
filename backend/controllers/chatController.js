const Chat = require("../model/chatModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// Get or create chat for logged in user
exports.getMyChat = catchAsyncError(async (req, res, next) => {
  let chat = await Chat.findOne({ user: req.user._id, status: "active" });

  if (!chat) {
    chat = await Chat.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      messages: [],
    });
  }

  res.status(200).json({
    success: true,
    chat,
  });
});

// Send message (user)
exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorHandler("Message is required", 400));
  }

  let chat = await Chat.findOne({ user: req.user._id, status: "active" });

  if (!chat) {
    chat = await Chat.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      messages: [],
    });
  }

  chat.messages.push({
    sender: "user",
    message,
    timestamp: new Date(),
  });

  await chat.save();

  res.status(200).json({
    success: true,
    chat,
  });
});

// Get all chats (admin)
exports.getAllChats = catchAsyncError(async (req, res, next) => {
  const chats = await Chat.find().sort({ lastMessage: -1 });

  // Count unread messages for each chat
  const chatsWithUnread = chats.map((chat) => {
    const unreadCount = chat.messages.filter(
      (msg) => msg.sender === "user" && !msg.read
    ).length;
    return {
      ...chat.toObject(),
      unreadCount,
    };
  });

  res.status(200).json({
    success: true,
    chats: chatsWithUnread,
  });
});

// Get single chat (admin)
exports.getChatById = catchAsyncError(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  res.status(200).json({
    success: true,
    chat,
  });
});

// Admin reply to chat
exports.adminReply = catchAsyncError(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorHandler("Message is required", 400));
  }

  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  chat.messages.push({
    sender: "admin",
    message,
    timestamp: new Date(),
  });

  await chat.save();

  res.status(200).json({
    success: true,
    chat,
  });
});

// Mark messages as read (admin)
exports.markAsRead = catchAsyncError(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  chat.messages.forEach((msg) => {
    if (msg.sender === "user") {
      msg.read = true;
    }
  });

  await chat.save();

  res.status(200).json({
    success: true,
    chat,
  });
});

// Close chat
exports.closeChat = catchAsyncError(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  chat.status = "closed";
  await chat.save();

  res.status(200).json({
    success: true,
    message: "Chat closed successfully",
  });
});

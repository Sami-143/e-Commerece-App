const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  lastMessage: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update lastMessage on new message
chatSchema.pre("save", function (next) {
  if (this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

module.exports = mongoose.model("Chat", chatSchema);

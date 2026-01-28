const express = require("express");
const {
  getMyChat,
  sendMessage,
  getAllChats,
  getChatById,
  adminReply,
  markAsRead,
  closeChat,
} = require("../controllers/chatController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

// User routes
router.route("/chat/my").get(isAuthenticatedUser, getMyChat);
router.route("/chat/send").post(isAuthenticatedUser, sendMessage);

// Admin routes
router
  .route("/admin/chats")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllChats);

router
  .route("/admin/chat/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getChatById);

router
  .route("/admin/chat/:id/reply")
  .post(isAuthenticatedUser, authorizedRoles("admin"), adminReply);

router
  .route("/admin/chat/:id/read")
  .put(isAuthenticatedUser, authorizedRoles("admin"), markAsRead);

router
  .route("/admin/chat/:id/close")
  .put(isAuthenticatedUser, authorizedRoles("admin"), closeChat);

module.exports = router;

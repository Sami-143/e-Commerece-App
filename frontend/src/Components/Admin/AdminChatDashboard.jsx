import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaComments, FaPaperPlane, FaCircle, FaArrowLeft, FaCheck, FaCheckDouble, FaTimes } from 'react-icons/fa';
import { getAllChats, getChatById, markAsRead, closeChat } from '../../Api/chatApi';
import AdminLayout from './AdminLayout';
import { toast } from 'react-toastify';

const AdminChatDashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:4000', {
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      setConnected(true);
      socketRef.current.emit('admin_join');
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for new messages from users
    socketRef.current.on('new_message', (data) => {
      // Update chat list
      setChats((prev) => {
        const updated = prev.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              messages: [...(chat.messages || []), data.message],
              lastMessage: data.message.timestamp,
              unreadCount: (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });
        // Sort by last message
        return updated.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage));
      });

      // Update current chat if it's the selected one
      if (selectedChat && selectedChat._id === data.chatId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    // Listen for typing indicators
    socketRef.current.on('user_typing', (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.chatId]: data.typing,
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedChat]);

  // Load all chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await getAllChats();
        setChats(res.data.chats);
      } catch (error) {
        toast.error('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select a chat
  const handleSelectChat = async (chat) => {
    setChatLoading(true);
    setSelectedChat(chat);
    
    try {
      const res = await getChatById(chat._id);
      setMessages(res.data.chat.messages || []);
      
      // Mark as read
      await markAsRead(chat._id);
      socketRef.current.emit('mark_read', chat._id);
      
      // Update unread count in list
      setChats((prev) =>
        prev.map((c) =>
          c._id === chat._id ? { ...c, unreadCount: 0 } : c
        )
      );
      
      // Join specific chat room
      socketRef.current.emit('admin_join_chat', chat._id);
    } catch (error) {
      toast.error('Failed to load chat');
    } finally {
      setChatLoading(false);
    }
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socketRef.current) return;

    socketRef.current.emit('admin_message', {
      chatId: selectedChat._id,
      message: newMessage,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: 'admin',
        message: newMessage,
        timestamp: new Date(),
      },
    ]);

    setNewMessage('');
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current && selectedChat) {
      socketRef.current.emit('typing_start', {
        userId: selectedChat.user,
        isAdmin: true,
      });
      
      clearTimeout(window.adminTypingTimeout);
      window.adminTypingTimeout = setTimeout(() => {
        socketRef.current.emit('typing_stop', {
          userId: selectedChat.user,
          isAdmin: true,
        });
      }, 2000);
    }
  };

  // Close chat
  const handleCloseChat = async () => {
    if (!selectedChat) return;
    
    try {
      await closeChat(selectedChat._id);
      toast.success('Chat closed');
      setChats((prev) => prev.filter((c) => c._id !== selectedChat._id));
      setSelectedChat(null);
      setMessages([]);
    } catch (error) {
      toast.error('Failed to close chat');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getTotalUnread = () => {
    return chats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-80px)] flex">
        {/* Chat List Sidebar */}
        <div className={`w-80 bg-gray-800 border-r border-gray-700 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaComments className="text-amber-400" />
                Support Chats
                {getTotalUnread() > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {getTotalUnread()}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-1 text-xs">
                <FaCircle className={`${connected ? 'text-green-400' : 'text-red-400'}`} size={8} />
                <span className="text-gray-400">{connected ? 'Live' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center text-gray-400 mt-10 px-4">
                <FaComments className="mx-auto text-4xl mb-3 opacity-50" />
                <p>No active chats</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition ${
                    selectedChat?._id === chat._id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                      {chat.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium truncate">{chat.userName}</h3>
                        <span className="text-gray-400 text-xs">{formatTime(chat.lastMessage)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm truncate">
                          {chat.messages?.[chat.messages.length - 1]?.message || 'No messages'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-amber-500 text-gray-900 text-xs px-2 py-0.5 rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      {typingUsers[chat._id] && (
                        <p className="text-amber-400 text-xs">Typing...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-gray-900 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden text-gray-400 hover:text-white"
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                      {selectedChat.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedChat.userName}</h3>
                      <p className="text-gray-400 text-sm">{selectedChat.userEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseChat}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Close Chat"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.sender === 'admin'
                            ? 'bg-amber-500 text-gray-900 rounded-br-sm'
                            : 'bg-gray-800 text-white rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'admin' ? 'text-gray-700' : 'text-gray-400'}`}>
                          <span className="text-xs">{formatTime(msg.timestamp)}</span>
                          {msg.sender === 'admin' && (
                            msg.read ? <FaCheckDouble size={12} /> : <FaCheck size={12} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a reply..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 px-6 rounded-xl transition"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FaComments className="mx-auto text-6xl mb-4 opacity-50" />
                <p className="text-xl">Select a chat to start responding</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChatDashboard;

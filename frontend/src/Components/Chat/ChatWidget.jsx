import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FaComments, FaTimes, FaPaperPlane, FaCircle } from 'react-icons/fa';
import { getMyChat } from '../../Api/chatApi';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      socketRef.current = io('http://localhost:4000', {
        withCredentials: true,
      });

      socketRef.current.on('connect', () => {
        setConnected(true);
        socketRef.current.emit('join_chat', user._id);
      });

      socketRef.current.on('disconnect', () => {
        setConnected(false);
      });

      // Listen for admin replies
      socketRef.current.on('admin_reply', (data) => {
        setMessages((prev) => [...prev, data.message]);
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      // Listen for typing indicator
      socketRef.current.on('admin_typing', (typing) => {
        setAdminTyping(typing);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isAuthenticated, user, isOpen]);

  // Load existing chat
  useEffect(() => {
    const loadChat = async () => {
      if (isAuthenticated && isOpen) {
        setLoading(true);
        try {
          const res = await getMyChat();
          setChatId(res.data.chat._id);
          setMessages(res.data.chat.messages || []);
          setUnreadCount(0);
        } catch (error) {
          console.error('Failed to load chat:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadChat();
  }, [isAuthenticated, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    // Emit message through socket
    socketRef.current.emit('user_message', {
      userId: user._id,
      message: newMessage,
      chatId,
    });

    // Add message locally
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        message: newMessage,
        timestamp: new Date(),
      },
    ]);

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current && chatId) {
      socketRef.current.emit('typing_start', { chatId, isAdmin: false });
      
      // Stop typing after 2 seconds of inactivity
      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socketRef.current.emit('typing_stop', { chatId, isAdmin: false });
      }, 2000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-gray-900 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        {isOpen ? (
          <FaTimes size={24} />
        ) : (
          <div className="relative">
            <FaComments size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <FaComments className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Support Chat</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <FaCircle className={`${connected ? 'text-green-400' : 'text-red-400'}`} size={8} />
                    <span className="text-gray-400">{connected ? 'Online' : 'Connecting...'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <FaComments className="mx-auto text-4xl mb-3 opacity-50" />
                <p>Start a conversation!</p>
                <p className="text-sm mt-1">We're here to help.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-gray-900 rounded-br-sm'
                        : 'bg-gray-800 text-white rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-gray-700' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {adminTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
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
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 p-3 rounded-xl transition"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

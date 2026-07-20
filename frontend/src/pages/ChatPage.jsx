import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';
import Sidebar from '../components/common/Sidebar.jsx';
import { 
  fetchConversations, 
  fetchMessageHistory, 
  addMessage, 
  updateConversationsList,
  clearMessages
} from '../redux/slices/chatSlice.js';
import useToast from '../hooks/useToast.js';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';

const ChatPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const addToast = useToast();
  
  const { user } = useSelector((state) => state.auth);
  const { conversations, messages, loading } = useSelector((state) => state.chat);

  const [selectedUser, setSelectedUser] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsersList, setOnlineUsersList] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Sync selected user ref to keep socket listeners stable
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';
      
    socketRef.current = io(socketUrl, {
      auth: {
        token: localStorage.getItem('token')
      },
      withCredentials: true
    });

    socketRef.current.emit('setup', user.id);
    
    socketRef.current.on('connected', () => {
      setSocketConnected(true);
    });

    // Listen for incoming messages
    socketRef.current.on('message_received', (newMsg) => {
      const activeUser = selectedUserRef.current;
      // Check if message belongs to active chat
      if (activeUser && newMsg.sender._id.toString() === activeUser._id.toString()) {
        dispatch(addMessage(newMsg));
      } else {
        addToast(`New message from ${newMsg.sender.name}`, 'info');
      }
      
      // Update conversations list
      dispatch(updateConversationsList({ ...newMsg, myId: user.id }));
    });

    // Listen for sent message confirmation (to append it locally)
    socketRef.current.on('message_sent', (newMsg) => {
      dispatch(addMessage(newMsg));
      dispatch(updateConversationsList({ ...newMsg, myId: user.id }));
    });

    // Listen for presence & typing events
    socketRef.current.on('online_users', (users) => {
      setOnlineUsersList(users.map(id => id.toString()));
    });

    socketRef.current.on('user_online', (userId) => {
      setOnlineUsersList((prev) => [...new Set([...prev, userId.toString()])]);
    });

    socketRef.current.on('user_offline', (userId) => {
      setOnlineUsersList((prev) => prev.filter((id) => id !== userId.toString()));
    });

    socketRef.current.on('typing_indicator', (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.sender.toString()]: data.isTyping
      }));
    });

    // Fetch initial conversations list
    dispatch(fetchConversations());

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      dispatch(clearMessages());
    };
  }, [dispatch, user.id, addToast]);

  // Handle passed user state (e.g. Recruiter clicking "Chat" from applications list)
  useEffect(() => {
    if (location.state && location.state.user) {
      const target = location.state.user;
      setSelectedUser(target);
      dispatch(fetchMessageHistory(target._id));
    }
  }, [location.state, dispatch]);

  // Fetch message history when selectedUser changes
  const handleSelectConversation = (otherUser) => {
    setSelectedUser(otherUser);
    dispatch(fetchMessageHistory(otherUser._id));
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing input changes
  const handleInputChange = (e) => {
    setTypedMessage(e.target.value);
    
    if (!socketRef.current || !selectedUser) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', { recipient: selectedUser._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing', { recipient: selectedUser._id });
      setIsTyping(false);
    }, 1500);
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedUser) return;

    if (socketRef.current) {
      socketRef.current.emit('new_message', {
        sender: user.id,
        recipient: selectedUser._id,
        content: typedMessage
      });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketRef.current.emit('stop_typing', { recipient: selectedUser._id });
      setIsTyping(false);
      
      setTypedMessage('');
    }
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex">
      <Sidebar />

      {/* Main Canvas */}
      <main className="ml-[280px] flex-1 h-screen flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
          <span className="font-sans text-xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">forum</span>
            Messages
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-on-tertiary-container bg-surface-container-low dark:bg-on-tertiary-fixed-variant px-3 py-1 rounded-full font-bold">
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Active Chats Sidebar */}
          <div className="w-[320px] border-r border-outline-variant/10 flex flex-col bg-surface dark:bg-transparent">
            <div className="p-4 border-b border-outline-variant/10">
              <h3 className="font-sans text-sm font-bold text-on-surface-variant dark:text-on-tertiary-container uppercase tracking-wider">Conversations</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/5">
              {loading ? (
                <LoadingSkeleton type="chat" />
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant dark:text-on-tertiary-container text-body-sm">
                  <span className="material-symbols-outlined text-3xl mb-2 text-outline-variant">chat_bubble</span>
                  <p>No messages yet.</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.user._id}
                    onClick={() => handleSelectConversation(conv.user)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-surface-container-low dark:hover:bg-on-tertiary-fixed-variant/40 ${
                      selectedUser?._id === conv.user._id 
                        ? 'bg-secondary-container/20 dark:bg-secondary-fixed/10 border-l-4 border-secondary' 
                        : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                        alt={conv.user.name}
                        className="w-11 h-11 rounded-full object-cover border border-outline-variant/10"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface dark:border-primary-container ${
                        onlineUsersList.includes(conv.user._id.toString()) ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-sans text-body-sm font-bold text-primary dark:text-white truncate">{conv.user.name}</h4>
                        <span className="text-[10px] text-on-surface-variant dark:text-on-tertiary-container">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${conv.unread ? 'font-bold text-primary dark:text-white' : 'text-on-surface-variant dark:text-on-tertiary-container'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Conversation Screen */}
          <div className="flex-1 flex flex-col justify-between bg-surface-container-lowest dark:bg-primary-container/5 overflow-hidden">
            {selectedUser ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 border-b border-outline-variant/10 bg-surface dark:bg-primary-container flex items-center gap-3 shadow-sm">
                  <div className="relative">
                    <img
                      src={selectedUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant/10"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-surface dark:border-primary-container ${
                      onlineUsersList.includes(selectedUser._id.toString()) ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></span>
                  </div>
                  <div>
                    <h4 className="font-sans text-body-sm font-bold text-primary dark:text-white flex items-center gap-2">
                      {selectedUser.name}
                      <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${
                        onlineUsersList.includes(selectedUser._id.toString()) 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-slate-400/10 text-slate-500'
                      }`}>
                        {onlineUsersList.includes(selectedUser._id.toString()) ? 'online' : 'offline'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-on-tertiary-container uppercase tracking-wider font-bold">
                      {selectedUser.role === 'admin' ? 'Recruiter' : 'Candidate'}
                    </p>
                  </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, index) => {
                    const isMyMessage = msg.sender._id.toString() === user.id.toString();
                    return (
                      <div
                        key={msg._id || index}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-2xl text-body-sm shadow-sm ${
                            isMyMessage
                              ? 'bg-secondary text-on-primary dark:bg-secondary dark:text-on-primary rounded-tr-none'
                              : 'bg-white dark:bg-primary-container text-on-surface dark:text-white rounded-tl-none border border-outline-variant/10'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <span className={`text-[9px] block mt-1 text-right ${isMyMessage ? 'text-on-primary/75' : 'text-on-surface-variant dark:text-on-tertiary-container'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Typing Indicator */}
                  {typingUsers[selectedUser._id.toString()] && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-primary-container text-on-surface dark:text-white px-4 py-3 rounded-2xl rounded-tl-none border border-outline-variant/10 shadow-sm flex items-center gap-2">
                        <span className="text-[11px] text-on-surface-variant dark:text-on-tertiary-container italic">typing</span>
                        <span className="flex gap-1 items-center h-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-surface dark:bg-primary-container border-t border-outline-variant/10 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={typedMessage}
                    onChange={handleInputChange}
                    className="flex-1 bg-surface-container-low dark:bg-on-tertiary-fixed-variant border border-outline-variant/20 dark:border-transparent rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-white transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-secondary text-on-primary p-3 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-on-surface-variant dark:text-on-tertiary-container text-center">
                <span className="material-symbols-outlined text-5xl mb-3 text-outline-variant">forum</span>
                <h3 className="font-sans text-lg font-bold">No Active Conversation</h3>
                <p className="text-body-sm mt-1 max-w-sm">Select a user from the conversations list, or chat directly from application dashboards.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

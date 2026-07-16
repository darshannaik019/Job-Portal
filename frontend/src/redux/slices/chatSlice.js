import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/messages/conversations');
      return data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessageHistory = createAsyncThunk(
  'chat/fetchMessageHistory',
  async (otherUserId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/messages/history/${otherUserId}`);
      return data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch message history');
    }
  }
);

const initialState = {
  conversations: [],
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // Append message if it belongs to the active conversation
      const message = action.payload;
      state.messages.push(message);
    },
    updateConversationsList: (state, action) => {
      const message = action.payload;
      const otherUser = message.sender._id.toString() === message.myId ? message.recipient : message.sender;
      
      const existingConvIndex = state.conversations.findIndex(
        conv => conv.user._id.toString() === otherUser._id.toString()
      );

      const convData = {
        user: otherUser,
        lastMessage: message.content,
        lastMessageTime: message.createdAt,
        unread: message.recipient._id.toString() === message.myId
      };

      if (existingConvIndex !== -1) {
        // Move to top and update last message
        state.conversations.splice(existingConvIndex, 1);
      }
      state.conversations.unshift(convData);
    },
    clearChatError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Message History
      .addCase(fetchMessageHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessageHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessageHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, updateConversationsList, clearChatError, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
  unreadMessages: {}, // Track unread messages per user
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    addMessage: (state, action) => {
      state.message.push(action.payload);
    },
    removeMessage: (state) => {
      state.message = [];
    },
    incrementUnreadMessage: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = (state.unreadMessages[userId] || 0) + 1;
    },
    resetUnreadMessage: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = 0;
    },
  },
});

// Export actions
export const {
  setMessage,
  addMessage,
  removeMessage,
  incrementUnreadMessage,
  resetUnreadMessage,
} = messageSlice.actions;

// Export selector
export const selectUnreadMessages = (state) => state.message.unreadMessages;

// Export reducer
export default messageSlice.reducer;
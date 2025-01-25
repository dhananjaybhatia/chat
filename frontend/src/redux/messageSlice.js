import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
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
  },
});

export const { setMessage, addMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;

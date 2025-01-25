import { configureStore } from "@reduxjs/toolkit";
import selectedUserReducer from "./selectedUserSlice";
import messageReducer from "./messageSlice";

export const store = configureStore({
  reducer: {
    selectedUser: selectedUserReducer,
    message: messageReducer,
  },
});

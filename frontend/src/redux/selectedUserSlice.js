import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: [], // List of users in the group
  loading: false,
  error: null,
};

const selectedUserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUsers: (state, action) => {
      console.log("Updating selected user in Redux:", action.payload);
      state.selectedUser = action.payload; // Correctly update selectedUser
    },
    addUser: (state, action) => {
      state.users.push(action.payload); // Add a new user to the group
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload); // Remove a user from the group
    },
  },
});

export const { setSelectedUsers, addUser, removeUser } =
  selectedUserSlice.actions;
export default selectedUserSlice.reducer;

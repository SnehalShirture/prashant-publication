import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  UserData: {},
  isRegistered: false,
  islogin: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.UserData = {};
      state.islogin = false; // Set login to false on logout
    },
    register: (state, action) => {
      state.UserData = action.payload;
      state.isRegistered = true;
      // state.login = true;
    },
    login: (state, action) => {
      state.UserData = action.payload;
      state.islogin = true; // Set login to true
    },
    clearUserData: (state) => {
      state.UserData = {};
      state.islogin = false;
    },
  },
});

export const { login, logout, register, clearUserData } = UserSlice.actions;
export default UserSlice.reducer;

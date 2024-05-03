import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  user: {},
};

const authSlice = createSlice({
  name: "atuh",
  initialState,
  reducers: {
    setAuthStatus: (state, { payload }) => {
      state.loggedIn = payload.loggedIn;
      state.user = payload.user;
    },
  },
});

export default authSlice.reducer;
export const { setAuthStatus } = authSlice.actions;

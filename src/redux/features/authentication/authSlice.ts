import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  user: {
    uuid: "",
    profile: {
      name: "",

      fatherName: "",
      motherName: "",
      phone: "",
      email: "",
      address: "",
      uuid: "",
      image: " ",
    },
    needsPasswordChange: false,
    _id: "",
    role: "",
  },
  token: "",
};

const authSlice = createSlice({
  name: "atuh",
  initialState,
  reducers: {
    setAuthStatus: (state, { payload }) => {
      state.loggedIn = payload.loggedIn;
      state.user = payload.user;
      state.token = payload.token;
    },
  },
});

export default authSlice.reducer;
export const { setAuthStatus } = authSlice.actions;

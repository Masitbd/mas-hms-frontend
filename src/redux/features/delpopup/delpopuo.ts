import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const del = createSlice({
  name: "condition",
  initialState,
  reducers: {
    setdel: (state, { payload }) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export default del.reducer;
export const { setdel } = del.actions;

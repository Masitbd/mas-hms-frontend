import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: true,
};
const loading = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export default loading.reducer;
export const { setLoading } = loading.actions;

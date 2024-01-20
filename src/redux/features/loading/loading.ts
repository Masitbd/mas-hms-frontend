import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
};
const loading = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

export default loading.reducer;
export const { setLoading } = loading.actions;

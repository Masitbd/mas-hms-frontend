import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  label: "",
  description: "",
};

const conditionSlice = createSlice({
  name: "condition",
  initialState,
  reducers: {
    setCondition: (state, { payload }) => {
      state.label = payload.label;
      state.description = payload.description;
    },
  },
});

export default conditionSlice.reducer;
export const { setCondition } = conditionSlice.actions;

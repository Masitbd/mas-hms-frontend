import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: ""
};
interface id {
  id: string;
}
const idSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setId: (state: id, action: PayloadAction<string>) => {
      state.id = action.payload;
    }
  }
});

export const { setId } = idSlice.actions;

export default idSlice.reducer;

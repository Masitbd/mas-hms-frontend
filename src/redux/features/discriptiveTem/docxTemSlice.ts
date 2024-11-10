import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DocxContentState {
  docxContent: string;
}

const initialState: DocxContentState = {
  docxContent: ""
};

const docxTemSlice = createSlice({
  name: "docxContent",
  initialState,
  reducers: {
    setDocxContent: (
      state: DocxContentState,
      action: PayloadAction<string>
    ) => {
      state.docxContent = action.payload;
    }
  }
});

export const { setDocxContent } = docxTemSlice.actions;

export default docxTemSlice.reducer;

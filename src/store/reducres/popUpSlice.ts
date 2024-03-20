import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface popUpState {
  isOpen: boolean;
  popUpContent: string;
}

const initialState: popUpState = {
  isOpen: false,
  popUpContent: "",
};

export const popUpSlice = createSlice({
  name: "popUp",
  initialState,
  reducers: {
    openPopup(state, action: PayloadAction<string>) {
      state.isOpen = true;
      state.popUpContent = action.payload;
    },
    closePopup(state) {
      state.isOpen = false;
      state.popUpContent = "";
    },
  },
});

export default popUpSlice.reducer;

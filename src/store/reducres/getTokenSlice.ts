import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface TokenState {
  token: string;
  isLoading: boolean;
  error: string;
}

const initialState: TokenState = {
  token: "",
  isLoading: false,
  error: "",
};

export const getTokenSlice = createSlice({
  name: "getToken",
  initialState,
  reducers: {
    getTokenFetch(state) {
      state.isLoading = true;
    },
    getTokenSuccess(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.token = action.payload;
      state.error = "";
    },
    getTokenError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default getTokenSlice.reducer;

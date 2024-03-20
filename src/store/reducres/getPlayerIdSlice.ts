import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlayerInfo } from "../../types/types";

interface PlayerIdState {
  playerId: string;
  userInfo: IPlayerInfo | null;
  isLoading: boolean;
  error: string;
  tokenReady: boolean;
  gameStart: boolean;
}
const initialState: PlayerIdState = {
  playerId: "",
  userInfo: null,
  isLoading: false,
  error: "",
  gameStart: false,
  tokenReady: false,
};
export const getPlayerIdSlice = createSlice({
  name: "getPlayerId",
  initialState,
  reducers: {
    getPlayerIdFetching(state, action: PayloadAction<IPlayerInfo>) {
      state.isLoading = true;
      state.userInfo = action.payload;
      state.gameStart = true;
    },
    getPlayerIdSuccess(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.playerId = action.payload;
      state.error = "";
    },
    getPlayerIdError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.gameStart = false;
    },
    changeGameStatus(state, action: PayloadAction<boolean>) {
      state.gameStart = action.payload;
    },
    getTokenReady(state) {
      state.tokenReady = true;
    },
    getTokenPrep(state) {
      state.tokenReady = false;
    },
  },
});

export default getPlayerIdSlice.reducer;

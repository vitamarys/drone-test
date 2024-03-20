import { api } from "../api/api";
import { IPlayerInfo, IPopUpContent } from "../types/types";
import { getPlayerIdSlice } from "./reducres/getPlayerIdSlice";
import { getTokenSlice } from "./reducres/getTokenSlice";
import { popUpSlice } from "./reducres/popUpSlice";
import { AppDispatch } from "./store";

export const fetchPlayerId =
  (info: IPlayerInfo) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPlayerIdSlice.actions.getTokenPrep());
      dispatch(getPlayerIdSlice.actions.getPlayerIdFetching(info));
      const response = await api.playerId(info);
      dispatch(getPlayerIdSlice.actions.getPlayerIdSuccess(response.id));
      return response.id;
    } catch (error: any) {
      dispatch(getPlayerIdSlice.actions.getPlayerIdError(error.message));
      throw error;
    }
  };

export const fetchToken =
  (playerId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getTokenSlice.actions.getTokenFetch());
      const response = await api.getToken(playerId);

      dispatch(getTokenSlice.actions.getTokenSuccess(response));
      dispatch(getPlayerIdSlice.actions.getTokenReady());
    } catch (error: any) {
      dispatch(getPlayerIdSlice.actions.getPlayerIdError(error.message));
      throw error;
    }
  };

export const closePopup = () => (dispatch: AppDispatch) => {
  dispatch(popUpSlice.actions.closePopup());
};
export const openPop = (val: string) => (dispatch: AppDispatch) => {
  dispatch(popUpSlice.actions.openPopup(val));
};
export const removeToken = () => (dispatch: AppDispatch) => {
  dispatch(getPlayerIdSlice.actions.getTokenPrep());
};
export const gameStatus = (val: boolean) => (dispatch: AppDispatch) => {
  dispatch(getPlayerIdSlice.actions.changeGameStatus(val));
};

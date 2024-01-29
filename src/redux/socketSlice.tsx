import { AlienBackofficeClient } from "@alienbackoffice/back-front";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export type SocketState = {
  boClient?: AlienBackofficeClient;
};

const initialState: SocketState = {};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    saveSocket: (state, action: PayloadAction<AlienBackofficeClient>) => {
      state.boClient = action.payload;
    },
    resetSocket: () => {
      return initialState;
    },
  },
});

export const { saveSocket, resetSocket } = socketSlice.actions;

export const selectSocket = (state: RootState) => state.socket;
export const selectBoClient = createSelector(selectSocket, (state) => state.boClient);

export default socketSlice.reducer;

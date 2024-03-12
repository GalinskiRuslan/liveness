"use client";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Liveness {
  isOpen: boolean;
}

interface AppState {
  liveness: Liveness;
  imageData: string | null;
}

const initialState: AppState = {
  liveness: { isOpen: false },
  imageData: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLiveness: (state, { payload }: PayloadAction<Liveness>) => {
      state.liveness = payload;
    },
    setImageData: (state, { payload }: PayloadAction<string | null>) => {
      state.imageData = payload;
    },
  },
});

export const { setLiveness, setImageData } = appSlice.actions;

export default appSlice.reducer;

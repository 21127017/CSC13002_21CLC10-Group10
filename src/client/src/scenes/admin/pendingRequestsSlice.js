// pendingRequestsSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingRequests: [],
};

const pendingRequestsSlice = createSlice({
  name: "pendingRequests",
  initialState,
  reducers: {
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    },
    // ...các actions khác
  },
});

export const { setPendingRequests } = pendingRequestsSlice.actions;
export default pendingRequestsSlice.reducer;

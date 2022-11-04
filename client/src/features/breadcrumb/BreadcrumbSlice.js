import { createSlice } from "@reduxjs/toolkit";

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: {
    path: [],
    prevScroll: 0,
  },
  reducers: {
    addPath: (state, action) => {
      state.path.push(action.payload);
    },
    removePath: (state, action) => {
      // console.log(action.payload)
      state.path = state.path.filter((item) => item !== action.payload);
    },
    changePath: (state, action) => {
      state.path = [action.payload];
    },
    setScroll: (state, action) => {
      state.prevScroll = action.payload;
    },
  },
});

export const { addPath, changePath, setScroll } = breadcrumbSlice.actions;
export const selectPaths = (state) => state.breadcrumb.path;
export const getPrevScroll = (state) => state.breadcrumb.prevScroll;
export default breadcrumbSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {
  PENDING: "pending",
  IDLE: "idle",
  LOGGED_IN: "logged",
  ERROR: "error",
  SIGNED_OUT: "signed_out",
};
export const INFO_STATUSES = {
  PENDING: "pending",
  IDLE: "idle",
  SUCCESS: "success",
  ERROR: "error",
};
export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }, thunkApi) => {
    const response = await axios({
      method: "POST",
      url: `${window.location.origin}/api/auth`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
      },
    });
    return response.data.token;
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, thunkApi) => {
    const state = await thunkApi.getState();
    const token = state.user.token;
    const response = await axios({
      method: "GET",
      url: `${window.location.origin}/api/users/profile`,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });
    return response.data.profile;
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (newData, thunkApi) => {
    const state = await thunkApi.getState();
    const token = state.user.token;
    await axios({
      method: "PATCH",
      url: `${window.location.origin}/api/users/update`,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      data: newData,
    });
    return newData;
  }
);

const initialState = {
  token: null,
  status: STATUSES.IDLE,
  userInfo: null,
  infoStatus: INFO_STATUSES.IDLE,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    signOut: (state) => {
      state.token = null;
      state.status = STATUSES.SIGNED_OUT;
      state.userInfo = null;
      state.infoStatus = INFO_STATUSES.IDLE;
    },
  },
  extraReducers: {
    //Login
    [login.fulfilled]: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.status = STATUSES.LOGGED_IN;
    },
    [login.pending]: (state, action) => {
      state.status = STATUSES.PENDING;
    },
    [login.rejected]: (state, action) => {
      state.status = STATUSES.ERROR;
    },
    //Init user
    [getUserInfo.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.infoStatus = INFO_STATUSES.SUCCESS;
    },
    [getUserInfo.pending]: (state, action) => {
      state.infoStatus = INFO_STATUSES.PENDING;
    },
    [getUserInfo.rejected]: (state, action) => {
      state.infoStatus = INFO_STATUSES.ERROR;
    },
    //Update user info
    [updateUserInfo.fulfilled]: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
      state.infoStatus = INFO_STATUSES.SUCCESS;
    },
    [updateUserInfo.pending]: (state, action) => {
      state.infoStatus = INFO_STATUSES.PENDING;
    },
    [updateUserInfo.rejected]: (state, action) => {
      state.infoStatus = INFO_STATUSES.ERROR;
    },
  },
});

export const { signOut } = userSlice.actions;
export const statusSelector = (state) => state.user.status;
export const infoStatusSelector = (state) => state.user.infoStatus;
export const infoSelector = (state) => state.user.userInfo;
export const tokenSelector = (state) => state.user.token;
export default userSlice.reducer;

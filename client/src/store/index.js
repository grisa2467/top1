import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import breadcrumbReducer from "../features/breadcrumb/BreadcrumbSlice";
import userReducer from "../features/user/userSlice";
const localStorageMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);
    localStorage.setItem("applicationState", JSON.stringify(getState()));
    return result;
  };
};

const reHydrateStore = () => {
  if (localStorage.getItem("applicationState") !== null) {
    return JSON.parse(localStorage.getItem("applicationState")); // re-hydrate the store
  }
};

const store = configureStore({
  reducer: {
    breadcrumb: breadcrumbReducer,
    user: userReducer,
  },
  preloadedState: reHydrateStore(),
  middleware: [localStorageMiddleware, ...getDefaultMiddleware()],
});

export default store;

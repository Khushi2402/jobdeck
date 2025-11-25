import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "../features/jobs/jobSlice.js";
import activitiesReducer from "../features/activities/activitiesSlice.js";
import profileReducer from "../features/profile/profileSlice.js";
import { loadState, saveState } from "./localStorage.js";
// Try to hydrate from localStorage
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    activities: activitiesReducer,
    profile: profileReducer,
  },
  preloadedState,
});

// Persist to localStorage on every change
store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

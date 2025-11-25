import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "../features/jobs/jobSlice.js";
import activitiesReducer from "../features/activities/activitiesSlice.js";
import { loadState, saveState } from "./localStorage.js";
// Try to hydrate from localStorage
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    activities: activitiesReducer,
  },
  preloadedState,
});

// Persist to localStorage on every change
store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

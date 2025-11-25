import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "../features/jobs/jobSlice.js";
import activitiesReducer from "../features/activities/activitiesSlice.js";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    activities: activitiesReducer,
  },
});

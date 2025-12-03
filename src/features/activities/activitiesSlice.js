// src/features/activities/activitiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchActivitiesApi,
  createActivityApi,
  deleteActivityApi,
} from "../../api/activitiesApi";

const initialState = {
  byJobId: {}, // { [jobId]: Activity[] }
  statusByJobId: {}, // { [jobId]: 'idle' | 'loading' | 'succeeded' | 'failed' }
  errorByJobId: {}, // { [jobId]: string | null }
};

// Load activities for a specific job
export const fetchActivitiesByJob = createAsyncThunk(
  "activities/fetchByJob",
  async ({ jobId, token }) => {
    const activities = await fetchActivitiesApi(jobId, token);
    return { jobId, activities };
  }
);

// Add a new activity
export const addActivity = createAsyncThunk(
  "activities/addActivity",
  async ({ jobId, type, title, description, token }) => {
    const activity = await createActivityApi(
      jobId,
      { type, title, description },
      token
    );
    return { jobId, activity };
  }
);

// Delete a single activity
export const deleteActivity = createAsyncThunk(
  "activities/deleteActivity",
  async ({ jobId, activityId, token }) => {
    await deleteActivityApi(activityId, token);
    return { jobId, activityId };
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    // Used when a job is deleted to clean up local cache
    removeActivitiesForJob(state, action) {
      const jobId = action.payload;
      delete state.byJobId[jobId];
      delete state.statusByJobId[jobId];
      delete state.errorByJobId[jobId];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchActivitiesByJob
      .addCase(fetchActivitiesByJob.pending, (state, action) => {
        const jobId = action.meta.arg.jobId;
        state.statusByJobId[jobId] = "loading";
        state.errorByJobId[jobId] = null;
      })
      .addCase(fetchActivitiesByJob.fulfilled, (state, action) => {
        const { jobId, activities } = action.payload;
        state.statusByJobId[jobId] = "succeeded";
        state.byJobId[jobId] = activities;
      })
      .addCase(fetchActivitiesByJob.rejected, (state, action) => {
        const jobId = action.meta.arg.jobId;
        state.statusByJobId[jobId] = "failed";
        state.errorByJobId[jobId] =
          action.error.message || "Failed to load activities";
      })

      // addActivity
      .addCase(addActivity.fulfilled, (state, action) => {
        const { jobId, activity } = action.payload;
        if (!state.byJobId[jobId]) {
          state.byJobId[jobId] = [];
        }
        state.byJobId[jobId].push(activity);
      })

      // deleteActivity
      .addCase(deleteActivity.fulfilled, (state, action) => {
        const { jobId, activityId } = action.payload;
        if (!state.byJobId[jobId]) return;
        state.byJobId[jobId] = state.byJobId[jobId].filter(
          (a) => a.id !== activityId
        );
      });
  },
});

export const { removeActivitiesForJob } = activitiesSlice.actions;

// Selector: same name used in JobDetailPage
export const selectActivitiesByJobId = (state, jobId) =>
  state.activities.byJobId[jobId] || [];

export const selectActivitiesStatusForJob = (state, jobId) =>
  state.activities.statusByJobId[jobId] || "idle";

export const selectActivitiesErrorForJob = (state, jobId) =>
  state.activities.errorByJobId[jobId] || null;

// NEW — selector used by DashboardPage to get all activities
export const selectAllActivities = (state) => {
  const byJob = state.activities?.byJobId || {};
  return Object.values(byJob).flat();
};

export default activitiesSlice.reducer;

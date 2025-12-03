// src/features/jobs/jobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchJobsApi,
  createJobApi,
  updateJobApi,
  deleteJobApi,
} from "../../api/jobsApi";

// State shape: { byId: { [id]: job }, allIds: [], status, error }
const initialState = {
  byId: {},
  allIds: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --------- Async thunks (backend calls) ---------

// Load all jobs from backend
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const jobs = await fetchJobsApi();
  return jobs;
});

// createJob
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async ({ payload, token }) => {
    const created = await createJobApi(payload, token);
    return created;
  }
);

// saveJobUpdates
export const saveJobUpdates = createAsyncThunk(
  "jobs/saveJobUpdates",
  async ({ id, updates, token }) => {
    const updated = await updateJobApi(id, updates, token);
    return updated;
  }
);

// updateJob (used by pipeline)
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, changes, token }) => {
    const updated = await updateJobApi(id, changes, token);
    return updated;
  }
);

// removeJob
export const removeJob = createAsyncThunk(
  "jobs/removeJob",
  async ({ id, token }) => {
    await deleteJobApi(id, token);
    return id;
  }
);

// --------- Helpers ---------

const normalizeJobs = (jobsArray) => {
  const byId = {};
  const allIds = [];
  for (const job of jobsArray) {
    byId[job.id] = job;
    allIds.push(job.id);
  }
  return { byId, allIds };
};

// --------- Slice ---------

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    // (optional) keep a purely local update if you need it somewhere later
    updateJobLocal(state, action) {
      const { id, changes } = action.payload;
      const existing = state.byId[id];
      if (existing) {
        state.byId[id] = {
          ...existing,
          ...changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const { byId, allIds } = normalizeJobs(action.payload);
        state.byId = byId;
        state.allIds = allIds;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load jobs";
      })

      // createJob
      .addCase(createJob.fulfilled, (state, action) => {
        const job = action.payload;
        state.byId[job.id] = job;
        // newest on top
        if (!state.allIds.includes(job.id)) {
          state.allIds.unshift(job.id);
        }
      })

      // saveJobUpdates (JobsPage)
      .addCase(saveJobUpdates.fulfilled, (state, action) => {
        const job = action.payload;
        state.byId[job.id] = job;
        if (!state.allIds.includes(job.id)) {
          state.allIds.unshift(job.id);
        }
      })

      // updateJob (PipelinePage)
      .addCase(updateJob.fulfilled, (state, action) => {
        const job = action.payload;
        state.byId[job.id] = job;
        if (!state.allIds.includes(job.id)) {
          state.allIds.unshift(job.id);
        }
      })

      // removeJob
      .addCase(removeJob.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.byId[id];
        state.allIds = state.allIds.filter((jobId) => jobId !== id);
      });
  },
});

// --------- Selectors ---------

export const selectAllJobs = (state) =>
  state.jobs.allIds.map((id) => state.jobs.byId[id]);

export const selectJobById = (state, id) => state.jobs.byId[id];

export const selectJobsStatus = (state) => state.jobs.status;
export const selectJobsError = (state) => state.jobs.error;

// Local-only reducer if needed
export const { updateJobLocal } = jobsSlice.actions;

// --------- Aliases for older code ---------
// So existing imports like `addJob`, `deleteJob`, `updateJob` still work.
export { createJob as addJob, removeJob as deleteJob };

export default jobsSlice.reducer;

import { createSlice, nanoid, createSelector } from "@reduxjs/toolkit";

const initialState = {
  byId: {},
  allIds: [],
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    addJob: {
      reducer(state, action) {
        const job = action.payload;
        state.byId[job.id] = job;
        state.allIds.push(job.id);
      },
      prepare(jobData) {
        return {
          payload: {
            id: nanoid(),
            status: "saved",
            createdAt: new Date().toISOString(),
            ...jobData,
          },
        };
      },
    },
    updateJob(state, action) {
      const { id, changes } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = {
          ...state.byId[id],
          ...changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteJob(state, action) {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter((jobId) => jobId !== id);
      }
    },
  },
});

export const { addJob, updateJob, deleteJob } = jobsSlice.actions;

const selectJobsState = (state) => state.jobs;

export const selectAllJobs = createSelector([selectJobsState], (jobsState) =>
  jobsState.allIds.map((id) => jobsState.byId[id])
);

export const selectJobById = (state, jobId) => state.jobs.byId[jobId];

export default jobsSlice.reducer;

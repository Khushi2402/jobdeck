import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  byJobId: {}, // jobId -> activity[]
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    addActivity: {
      reducer(state, action) {
        const activity = action.payload;
        const list = state.byJobId[activity.jobId] || [];
        state.byJobId[activity.jobId] = [...list, activity];
      },
      prepare({ jobId, type, title, description, date }) {
        return {
          payload: {
            id: nanoid(),
            jobId,
            type,
            title,
            description: description || "",
            date: date || new Date().toISOString(),
          },
        };
      },
      removeActivitiesForJob(state, action) {
        const jobId = action.payload;
        if (state.byJobId[jobId]) {
          delete state.byJobId[jobId];
        }
      },
    },
  },
});

export const { addActivity, removeActivitiesForJob } = activitiesSlice.actions;

export const selectActivitiesByJobId = (state, jobId) =>
  state.activities.byJobId[jobId] || [];

export const selectAllActivities = (state) => {
  const result = [];
  const byJobId = state.activities.byJobId;

  Object.keys(byJobId).forEach((jobId) => {
    byJobId[jobId].forEach((activity) => {
      result.push(activity);
    });
  });

  return result;
};

export default activitiesSlice.reducer;

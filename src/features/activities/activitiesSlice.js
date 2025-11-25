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
    },
  },
});

export const { addActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;

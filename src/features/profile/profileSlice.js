// src/features/profile/profileSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  byUserId: {}, // userId -> profile object
};

const getOrCreateProfile = (state, userId) => {
  if (!state.byUserId[userId]) {
    state.byUserId[userId] = {
      basicInfo: {
        title: "",
        company: "",
        noticePeriod: "",
        workMode: "",
        location: "",
        preferredRoles: [],
        preferredLocations: [],
      },
      skills: [],
      experiences: [],
      education: [],
      summary: "",
      career: {
        targetRoles: [],
        wantMoreOf: "",
      },
      resume: null, // { fileName, size, uploadedAt }
    };
  }
  return state.byUserId[userId];
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    upsertBasicInfo(state, action) {
      const { userId, basicInfo } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.basicInfo = { ...profile.basicInfo, ...basicInfo };
    },
    setSkills(state, action) {
      const { userId, skills } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.skills = skills;
    },
    addExperience(state, action) {
      const { userId, experience } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.experiences.push({
        id: nanoid(),
        ...experience,
      });
    },
    setEducation(state, action) {
      const { userId, education } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.education = education;
    },
    setSummary(state, action) {
      const { userId, summary } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.summary = summary;
    },
    setCareer(state, action) {
      const { userId, career } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.career = { ...profile.career, ...career };
    },
    setResumeMeta(state, action) {
      const { userId, resume } = action.payload;
      const profile = getOrCreateProfile(state, userId);
      profile.resume = resume;
    },
  },
});

export const {
  upsertBasicInfo,
  setSkills,
  addExperience,
  setEducation,
  setSummary,
  setCareer,
  setResumeMeta,
} = profileSlice.actions;

// selector with userId param
export const selectProfileForUser = (state, userId) =>
  (userId && state.profile.byUserId[userId]) || null;

export default profileSlice.reducer;

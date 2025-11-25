import { create } from "zustand";

export const useUIStore = create((set) => ({
  jobFilters: {
    status: "all",
    source: "all",
    search: "",
  },
  setJobFilters: (partialFilters) =>
    set((state) => ({
      jobFilters: {
        ...state.jobFilters,
        ...partialFilters,
      },
    })),
  // You can add more UI stuff later (selected tab, layout prefs, etc.)
}));

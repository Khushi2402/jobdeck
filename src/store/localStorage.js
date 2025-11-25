const STORAGE_KEY = "job-deck-state";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return undefined; // let Redux use initialState
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state from localStorage", err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const partial = {
      jobs: state.jobs,
      activities: state.activities,
    };
    const serializedState = JSON.stringify(partial);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage", err);
  }
};

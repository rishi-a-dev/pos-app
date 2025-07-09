export const dbSlice = (set) => ({
  dbData: null,
  setDbData: (dbData) => set({ dbData }),
  resetDbData: () => set({ dbData: null }),
});

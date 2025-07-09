export const sectionTableSlice = (set) => ({
  sections: [],
  setSectionsList: (sections) => set({ sections }),
  tables: [],
  setTablesList: (tables) => set({ tables }),
  section: null,
  setSection: (section) => set({ section }),
  table: null,
  setTable: (table) => set({ table }),
  resetSectionTable: () =>
    set({ sections: [], tables: [], section: null, table: null }),
});

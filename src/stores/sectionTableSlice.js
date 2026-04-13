export const sectionTableSlice = (set) => ({
  sections: [],
  setSectionsList: (sections) => set({ sections }),
  tables: [],
  setTablesList: (tables) => set({ tables }),
  section: null,
  setSection: (section) => set({ section }),
  table: null,
  setTable: (table) => set({ table }),
  /** Matches Table screen grouping: tableName or `table-${id}` */
  selectedTableGroupKey: null,
  setSelectedTableGroupKey: (key) => set({ selectedTableGroupKey: key }),
  resetSectionTable: () =>
    set({
      sections: [],
      tables: [],
      section: null,
      table: null,
      selectedTableGroupKey: null,
    }),
});

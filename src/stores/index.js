import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "./storage";
import { dbSlice } from "./dbSlice";
import { waiterSlice } from "./waiterSlice";
import { ordersSlice } from "./ordersSlice";
import { sectionTableSlice } from "./sectionTableSlice";

export const useAppStore = create()(
  persist(
    (set) => ({
      ...dbSlice(set),
      ...waiterSlice(set),
      ...ordersSlice(set),
      ...sectionTableSlice(set),
      resetStore: () => {
        set({
          dbData: null,
          waiters: [],
          waiter: null,
          sections: [],
          tables: [],
          section: null,
          table: null,
        });
      },
    }),
    {
      name: "pos-store",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        dbData: state.dbData,
      }),
    }
  )
);

export const waiterSlice = (set) => ({
  waiters: [],
  setWaitersList: (waiters) => set({ waiters }),
  waiter: null,
  setWaiter: (waiter) => set({ waiter }),
  resetWaiter: () => set({ waiter: null, waiters: [] }),
});

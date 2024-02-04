import { defineStore } from "pinia";

export const usePeriodStore = defineStore("period", {
  state: () => ({
    periods: [],
  }),
  actions: {
    setPeriods(data) {
      this.periods = data;
    },
  },
});

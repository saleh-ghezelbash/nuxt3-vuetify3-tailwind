import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),
  actions: {
    errorNotification(text) {
      this.notifications.unshift({
        id: Date.now(),
        text,
        type: "error",
      });
    },
    successNotification(text) {
      this.notifications.unshift({
        id: Date.now(),
        text,
        type: "success",
      });
    },
    warningNotification(text) {
      this.notifications.unshift({
        id: Date.now(),
        text,
        type: "warning",
      });
    },
    removeNotification(id) {
      const ID = this.notifications.findIndex((item) => item.id === id);
      this.notifications.splice(ID, 1);
    },
    removeAllNotifications() {
      this.notifications = [];
    },
  },
});

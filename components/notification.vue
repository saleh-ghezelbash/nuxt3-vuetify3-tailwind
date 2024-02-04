<template>
  <v-alert
    :type="notification.type"
    :icon="notificationIcon(notification.type)"
    border="left"
    dismissible
    class="tw-z-50"
    elevation="10"
  >
    <template #close>
      <v-progress-circular
        :value="dismissValue"
        color="red-darken-1"
        width="2.5"
        size="25"
      >
        <v-btn small icon @click="closeNotification">
          <v-icon small> mdi-close </v-icon>
        </v-btn>
      </v-progress-circular>
    </template>
    {{ notification.text }}
  </v-alert>
</template>

<script>
import { useNotificationStore } from "~/store/notification";

export default {
  name: "NotificationComponent",
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  emits: ["dismiss"],
  data() {
    return {
      dismissValue: 100,
      dismissTime: 0,
    };
  },
  created() {
    this.dismissTimer();
  },
  methods: {
    dismissTimer() {
      this.dismissTime = setInterval(() => {
        this.dismissValue -= 5;
        if (this.dismissValue === 0) {
          clearInterval(this.dismissTime);
          setTimeout(() => {
            this.closeNotification();
          }, 750);
        }
      }, 190);
    },
    closeNotification() {
      clearInterval(this.dismissTime);
      const store = useNotificationStore();
      store.removeNotification(this.notification.id);
      this.$emit("dismiss");
    },
    notificationIcon(type) {
      if (type === "success") {
        return "mdi-check-circle-outline";
      } else if (type === "error") {
        return "mdi-alert-circle-outline";
      } else {
        return "mdi-alert-outline";
      }
    },
  },
};
</script>

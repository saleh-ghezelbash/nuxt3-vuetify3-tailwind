import axios from "axios";
import { useNotificationStore } from "../store/notification";

export default defineNuxtPlugin((nuxtApp) => {
  //   console.log("axios plugin", nuxtApp);
  const store = useNotificationStore();
  const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  const cookie = useCookie("auth");
  if (cookie.value?.token) {
    api.defaults.headers.common.Authorization = "Bearer " + cookie.value.token;
  }

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.data.message) {
        if (!error.response.data.type) {
          store.errorNotification(error.response.data.message);
        } else {
          store.warningNotification(error.response.data.message);
        }
      } else {
        store.errorNotification(
          nuxtApp.$notificationHandler.translateError(error),
        );
      }
      if (error.response.status === 401 && nuxtApp.$route.path !== "/login") {
        cookie.value.token = "";
        navigateTo("/login");
      }
    },
  );

  return {
    provide: {
      axios: api,
    },
  };
});

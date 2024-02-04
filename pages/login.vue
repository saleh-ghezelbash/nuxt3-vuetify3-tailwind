<template>
  <div class="tw-h-5/6">
    <div
      class="tw-absolute tw-w-full tw-h-full tw-top-0"
      style="background-size: cover; filter: brightness(0.4)"
      :style="
        $vuetify.theme.dark
          ? 'background-image: url(&quot;./dark-bg.jpg&quot;);'
          : 'background-image: url(&quot;./light-bg.jpg&quot;);'
      "
    />
    <!-- <v-img
        src="/aftabor-logo.png"
        width="150"
        height="100"
        class="tw-mr-5 tw-mt-5 tw-invert"
      /> -->
    <div
      class="tw-absolute tw-w-11/12 md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-h-72 xl:tw-h-auto tw-rounded main-container"
    >
      <v-container
        fluid
        :style="$vuetify.theme.dark ? 'background-color: #1e1e1e;' : null"
      >
        <v-form ref="form">
          <div class="mb-4">ورود</div>
          <v-text-field
            v-model="username"
            label="نام کاربری"
            density="comfortable"
            clearable
            :rules="[hasValue(username, 'نام کاربری')]"
            :disabled="loading"
            @keydown.enter="login"
          />
          <v-text-field
            v-model="password"
            label="رمز عبور"
            density="comfortable"
            type="password"
            clearable
            :rules="[hasValue(password, 'رمز عبور')]"
            class="tw-mt-2"
            :disabled="loading"
            autocomplete="new-password"
            @keydown.enter="login"
          />
          <v-btn
            block
            color="primary"
            dark
            class="tw-mt-2.5"
            :loading="loading"
            @click="login"
          >
            ورود
          </v-btn>
        </v-form>
      </v-container>
    </div>

    <div
      class="tw-flex tw-flex-col-reverse tw-w-1/4 tw-h-4/5 tw-mr-auto tw-pl-3"
    >
      <template v-for="notification in notifications" :key="notification.id">
        <notification :notification="notification" />
      </template>
    </div>
  </div>
</template>

<script>
import moment from "moment";
// import { mapState } from "vuex";
import { mapState } from "pinia";
import { rules } from "../mixins/rules";
import notification from "../components/notification.vue";
import { useNotificationStore } from "../store/notification";
// const { $axios } = useNuxtApp();
// const router = useRouter();

export default {
  components: { notification },
  mixins: [rules],
  middleware: "authenticated",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
  head() {
    return {
      title: "ورود",
    };
  },
  computed: {
    ...mapState(useNotificationStore, ["notifications"]),
  },
  mounted() {
    // console.log("auth", useCookie("auth"));
    if (useCookie("darkMode").value) {
      this.$vuetify.theme.dark = true;
    } else {
      this.$vuetify.theme.dark = false;
    }
  },
  methods: {
    login() {
      const { $axios } = useNuxtApp();
      if (this.$refs.form.validate()) {
        this.error = "";
        this.loading = true;
        $axios
          .post("api/login", {
            username: this.username,
            password: this.password,
          })
          .then((res) => {
            res.data.shift = this.checkShift();

            const cookie = useCookie("auth", {
              path: "/",
              maxAge: 28800,
            });
            cookie.value = res.data;

            $axios.defaults.headers.common.Authorization =
              "Bearer " + res.data.token;

            const store = useNotificationStore();
            store.removeAllNotifications();

            const router = useRouter();
            router.push("/");
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    checkShift() {
      this.$axios.get("api/currentTime").then((res) => {
        moment.parseZone(res.data).local().format("HH:mm");
      });
      if (
        moment().isBetween(
          moment("07:00 am", "HH:mm a"),
          moment("15:00 pm", "HH:mm a"),
        )
      ) {
        return "صبح";
      } else if (
        moment().isBetween(
          moment("15:01 am", "HH:mm a"),
          moment("23:00 pm", "HH:mm a"),
        )
      ) {
        return "عصر";
      } else {
        return "شب";
      }
    },
  },
};
</script>

<style scoped>
.main-container {
  background-color: #ffffffbc !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

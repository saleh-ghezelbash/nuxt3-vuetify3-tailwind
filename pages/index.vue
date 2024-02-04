<template>
  <v-app>
    <div class="tw-w-full tw-z-10">
      <!-- <v-img
        src="/aftabor-logo.png"
        width="150"
        height="100"
        class="mr-5 mt-5 tw-invert"
      /> -->
      <div class="tw-w-full tw-text-8xl tw-text-white tw-text-center tw-mt-20">
        {{ currentTime }}
      </div>
      <div class="tw-w-full tw-text-3xl tw-text-white tw-text-center tw-mt-3">
        {{ dayOfWeek }}
        {{ currentDate }}
      </div>
      <!-- <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            absolute
            left
            bottom
            v-on="on"
            @click="aboutDialog = true"
          >
            <v-icon color="white">
              mdi-information-outline
            </v-icon>
          </v-btn>
        </template>
        <span>درباره برنامه</span>
      </v-tooltip>
      <v-menu
        v-model="aboutDialog"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        bottom="0"
      >
        <v-card>
          <v-card-text>
            test
          </v-card-text>
        </v-card>
      </v-menu> -->
      <div class="text-center">
        <v-menu top transition="scale-transition" offset-y>
          <template #activator="{ on: menu, attrs }">
            <v-tooltip top>
              <template #activator="{ on: tooltip }">
                <v-btn
                  v-bind="attrs"
                  icon
                  absolute
                  left
                  bottom
                  v-on="{ ...tooltip, ...menu }"
                  @click="aboutDialog = true"
                >
                  <v-icon color="white"> mdi-information-outline </v-icon>
                </v-btn>
              </template>
              <span>درباره برنامه</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-text>
              <div class="d-flex tw-gap-x-3 tw-mb-3">
                <v-icon>mdi-information-variant</v-icon>
                <div>نسخه: 1.8.2</div>
              </div>
              <div class="d-flex tw-gap-x-3">
                <v-icon>mdi-xml</v-icon>
                <div>
                  توسعه دهنده:
                  <a href="mailto:kamali_milad@outlook.com">میلاد کمالی</a>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
    <div
      class="tw-absolute tw-w-full tw-h-full tw-z-0"
      style="background-size: 100% 110%; filter: brightness(0.7)"
      :style="
        $vuetify.theme.dark
          ? 'background-image: url(&quot;./dark-bg.jpg&quot;);'
          : 'background-image: url(&quot;./light-bg.jpg&quot;);'
      "
    />
  </v-app>
</template>

<script>
import moment from "moment-jalaali";
import permissionsList from "~/globals/permissions-list";

export default {
  name: "IndexPage",
  // layout: "dashboard",
  middleware: ["auth", "permission"],
  data() {
    return {
      items: [
        { text: "داشبورد", icon: "mdi-view-dashboard-outline", page: "/" },
        { text: "ثبت اطلاعات" },
        {
          text: "ورودی",
          icon: "mdi-file-download-outline",
          page: "/weighbridge/input",
        },
        {
          text: "خروجی",
          icon: "mdi-file-upload-outline",
          page: "/weighbridge/bulk-output",
        },
        { text: "اسکله", icon: "mdi-pier-crane", page: "/weighbridge/pier" },
        { text: "گزارش" },
        {
          text: "گزارش اطلاعات ورودی",
          icon: "mdi-text-box-search-outline",
          page: "/weighbridge/input-report",
        },
        {
          text: "گزارش اطلاعات خروجی",
          icon: "mdi-text-box-search-outline",
          page: "/weighbridge/bulk-output-report",
        },
        {
          text: "گزارش اسکله",
          icon: "mdi-text-box-search-outline",
          page: "/weighbridge/pier-report",
        },
        { text: "مدیریت" },
        {
          text: "مانده قرارداد",
          icon: "mdi-file-sign",
          page: "/weighbridge/contract-remaining",
        },
        {
          text: "کاربران",
          icon: "mdi-account-multiple-outline",
          page: "/users",
        },
        {
          text: "لیست منابع",
          icon: "mdi-clipboard-text-outline",
          page: "/weighbridge/resources-list",
        },
      ],
      routes: [],
      userName: "",
      currentTime: "",
      currentDate: "",
      dayOfWeek: "",
      aboutDialog: false,
    };
  },
  head() {
    return {
      title: "داشبورد",
    };
  },
  computed: {
    menuItems() {
      const ITEMS = [];
      this.items.forEach((item) => {
        if (this.routes.includes(item.page)) {
          ITEMS.push(item);
        }
      });
      return ITEMS;
    },
  },
  created() {
    definePageMeta({
      layout: "dashboard",
    });
    const auth = useCookie("auth");
    this.userName = auth.value.user.name;
    const USER_ROLE = auth.value.user.role;
    Object.entries(permissionsList).forEach(([url, roles]) => {
      if (roles.includes(USER_ROLE)) {
        this.routes.push(url);
      }
    });
    moment.loadPersian({ usePersianDigits: true });
    moment.locale("fa");
    this.currentTime = moment().format("HH:mm");
    this.currentDate = moment().format("jYYYY/jMM/jDD");
    this.dayOfWeek = moment().format("dddd");
    this.currentDateTime();
  },
  methods: {
    currentDateTime() {
      setInterval(() => {
        this.currentTime = moment().format("HH:mm");
      }, 1000);
    },
    logout() {
      const auth = useCookie("auth");
      auth.value = "";

      const router = useRouter();
      router.push("/login");
    },
  },
};
</script>

<style>
.navigationDrawer .v-navigation-drawer__content {
  overflow-y: hidden !important;
}
.vList {
  height: 78vh;
}
.scrollBars {
  scrollbar-color: #989898 #d9d9d9;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
.scrollBars::-webkit-scrollbar {
  background-color: #ececec;
  width: 8px;
  height: 5px;
  border-radius: 20px;
}
.scrollBars::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
}
.scrollBars::-webkit-scrollbar-thumb:hover {
  background-color: #989898;
  cursor: s-resize;
  transition: background 2s;
}
</style>

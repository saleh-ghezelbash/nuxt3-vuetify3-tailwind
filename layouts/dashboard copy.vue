<template>
  <v-app>
    <v-card
      v-if="$vuetify.display.xs || $vuetify.display.sm || $vuetify.display.md"
      elevation="1"
      class="!tw-fixed !tw-top-0 !tw-left-0 !tw-w-full !tw-mb-2 !md:tw-mb-2 tw-z-10"
    >
      <div class="!tw-flex tw-gap-x-2 tw-items-center">
        <v-btn v-if="!drawer" icon elevation="0" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <div v-if="route.path != '/'" class="tw-text-lg tw-font-semibold">
          {{ pageTitle }}
        </div>
      </div>
    </v-card>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      class="navigationDrawer z-500"
    >
      <v-sheet
        :color="$vuetify.theme.dark ? null : 'grey lighten-3'"
        class="pa-4 tw-flex tw-items-center tw-relative"
      >
        <div class="tw-fixed tw-right-2.5 tw-top-0 tw-h-40">
          <div class="tw-relative d-flex tw-flex-col tw-h-40 tw-pt-1">
            <v-menu
              transition="slide-y-transition"
              :close-on-content-click="false"
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list width="250">
                <v-list-item-group class="px-2">
                  <v-list-item link @click="toggleTheme">
                    <v-row dense no-gutters>
                      <v-col cols="3">
                        <v-icon v-if="$vuetify.theme.dark">
                          mdi-moon-waning-crescent
                        </v-icon>
                        <v-icon v-else> mdi-white-balance-sunny </v-icon>
                      </v-col>
                      <v-col cols="7">
                        {{ $vuetify.theme.dark ? "زمینه روشن" : "زمینه تیره" }}
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-divider v-if="showPeriod" class="my-1" />
                  <v-list-item v-if="showPeriod" @click="openPeriodDialog">
                    <v-row no-gutters dense>
                      <v-col cols="3">
                        <v-icon>mdi-calendar-range</v-icon>
                      </v-col>
                      <v-col cols="7"> بازه زمانی </v-col>
                    </v-row>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
            <v-tooltip class="!tw-mt-auto" bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  absolute
                  class="tw-bottom-0"
                  v-on="on"
                  @click="logout"
                >
                  <v-icon>mdi-logout-variant</v-icon>
                </v-btn>
              </template>
              <span>خروج</span>
            </v-tooltip>
          </div>
        </div>
        <div class="d-flex tw-flex-col tw-mx-auto">
          <v-avatar
            class="tw-border mb-2 tw-shadow tw-cursor-pointer"
            color="darken-1"
            size="100"
            @click="editProfile"
          >
            <v-icon v-if="!user.profile_picture" size="60">
              mdi-account
            </v-icon>
            <v-img
              v-else
              :src="baseUrl + 'profile_pictures/' + user.id + '.jpg'"
            />
          </v-avatar>
          <div class="tw-text-center tw-cursor-pointer" @click="editProfile">
            {{ user.name }}
          </div>
        </div>
      </v-sheet>

      <v-divider />

      <v-list shaped class="vList tw-overflow-y-auto scrollBars tw-pb-10">
        <template v-for="(item, i) in menuItems">
          <v-list-item-group v-if="!item.items" :key="i" class="my-1">
            <!-- <v-subheader
                v-if="!item.page"
                :key="i"
              >
                {{ item.text }}
              </v-subheader> -->
            <v-list-item
              link
              nuxt
              active-class="primary !tw-text-white"
              :to="item.page"
            >
              <v-list-item-icon>
                <v-icon :style="item.reverse ? 'transform: scaleX(-1)' : null">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content class="!-tw-mr-3.5">
                <v-tooltip v-if="item.text.length > 18" top>
                  <template #activator="{ on, attrs }">
                    <v-list-item-title v-bind="attrs" v-on="on">
                      {{ item.text }}
                    </v-list-item-title>
                  </template>
                  <span>{{ item.text }}</span>
                </v-tooltip>
                <v-list-item-title v-else>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-group
            v-if="item.items?.length > 0"
            :key="i"
            :value="checkUrl(item.categoryUrl)"
            :prepend-icon="item.icon"
            :style="$vuetify.theme.dark ? 'color: #fff !important;' : null"
          >
            <template #activator>
              <v-list-item-title class="!-tw-mr-3.5">
                {{ item.text }}
              </v-list-item-title>
            </template>
            <v-list-item
              v-for="(submenu, j) in item.items"
              :key="j"
              link
              nuxt
              class="tw-mr-8"
              active-class="primary !tw-text-white"
              :to="submenu.page"
            >
              <v-list-item-icon>
                <v-icon
                  :style="submenu.reverse ? 'transform: scaleX(-1)' : null"
                >
                  {{ submenu.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-tooltip v-if="submenu.text.length > 16" top>
                <template #activator="{ on, attrs }">
                  <v-list-item-title
                    v-bind="attrs"
                    class="!tw-text-sm !-tw-mr-3.5"
                    v-on="on"
                  >
                    {{ submenu.text }}
                  </v-list-item-title>
                </template>
                <span class="!tw-text-sm">{{ submenu.text }}</span>
              </v-tooltip>
              <v-list-item-title v-else class="!tw-text-sm !-tw-mr-3.5">
                {{ submenu.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="tw-relative"
      :class="[
        route.path !== '/' ? 'pb-8' : null,
        $vuetify.theme.dark ? 'darkMainBg' : 'tw-bg-gray-100',
        ($vuetify.display.xs || $vuetify.display.sm || $vuetify.display.md) &&
          '!tw-mt-8',
      ]"
    >
      <v-container
        fluid
        :style="route.path === '/' ? 'padding: 0 !important;' : null"
      >
        <!-- Page Title -->
        <div
          v-if="
            route.path != '/' &&
            !$vuetify.display.xs &&
            !$vuetify.display.sm &&
            !$vuetify.display.md
          "
          class="tw-text-2xl tw-font-semibold tw-mb-4"
        >
          {{ pageTitle }}
        </div>
        <!-- Notifications -->
        <div
          class="tw-fixed tw-bottom-20 tw-left-5 tw-flex tw-flex-col-reverse tw-w-1/4 tw-mr-auto tw-pl-3 z-500"
        >
          <template
            v-for="notification in notifications"
            :key="notification.id"
          >
            <notification :notification="notification" />
          </template>
        </div>
        <transition name="fade">
          <!-- <Nuxt /> -->
          <slot />
          <!-- <NuxtLayout>
            <NuxtPage />
          </NuxtLayout> -->
        </transition>
      </v-container>
    </v-main>
    <!-- ویرایش اطلاعات حساب کاربری -->
    <v-dialog v-model="editProfileDialog" persistent width="500">
      <v-card>
        <v-card-title> ویرایش اطلاعات حساب کاربری </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="profileForm" :disabled="loading === 'save'">
              <v-row dense>
                <v-col cols="12" class="d-flex">
                  <v-avatar
                    class="tw-border mb-2 tw-shadow tw-cursor-pointer mx-auto"
                    color="darken-1"
                    size="100"
                    @click="openSelectProfilePicture"
                  >
                    <v-img v-if="profilePictureSrc" :src="profilePictureSrc" />
                    <div v-else>
                      <v-icon size="60"> mdi-account </v-icon>
                    </div>
                  </v-avatar>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :value="user.name"
                    label="نام و نام خانوادگی"
                    disabled
                  />
                </v-col>
                <v-col cols="12">
                  <a
                    elevation="0"
                    class="text-decoration-none"
                    @click="showPassword = !showPassword"
                  >
                    تغییر رمز عبور
                  </a>
                </v-col>
                <template v-if="showPassword">
                  <v-col cols="12">
                    <v-text-field
                      v-model="currentPassword"
                      label="رمز عبور جاری"
                      type="password"
                      :rules="[
                        hasValue(currentPassword, 'رمز عبور جاری'),
                        passwordLength(currentPassword),
                      ]"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newPassword"
                      label="رمز عبور جدید"
                      type="password"
                      :rules="[
                        hasValue(newPassword, 'رمز عبور جدید'),
                        passwordLength(newPassword),
                      ]"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="repeatNewPassword"
                      label="تکرار رمز عبور جدید"
                      type="password"
                      :rules="[
                        hasValue(repeatNewPassword, 'تکرار رمز عبور جدید'),
                        passwordLength(repeatNewPassword),
                        repeatNewPasswordCheck,
                      ]"
                    />
                  </v-col>
                </template>
              </v-row>
              <input
                ref="input"
                class="d-none"
                type="file"
                accept="image/*"
                @change="setProfilePicture"
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn plain :loading="loading === 'save'" @click="saveProfile">
            ذخیره
          </v-btn>
          <v-btn
            plain
            :disabled="loading === 'save'"
            @click="cancelProfileDialog"
          >
            انصراف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- بازه زمانی -->
    <v-dialog v-model="periodDialog" persistent width="500">
      <v-card>
        <v-card-title> بازه زمانی </v-card-title>
        <v-card-text class="pa-0">
          <v-tabs v-model="periodDialogActiveTab" grow class="px-3">
            <v-tab class="d-flex tw-gap-x-3">
              <v-icon>mdi-calendar-range</v-icon>
              بازه زمانی
            </v-tab>
            <v-tab :disabled="!userPermission" class="d-flex tw-gap-x-3">
              <v-icon>mdi-calendar-plus</v-icon>
              تعریف بازه زمانی
            </v-tab>
            <!-- بازه زمانی جاری -->
            <v-tab-item class="pa-3">
              <v-form ref="currentPeriod">
                <v-row dense>
                  <v-col cols="7" class="mx-auto">
                    <v-autocomplete
                      v-model="currentPeriod"
                      label="بازه زمانی جاری"
                      item-text="title"
                      item-value="id"
                      :items="periods"
                      :rules="[hasValue(currentPeriod, 'بازه زمانی جاری')]"
                    />
                    <div class="text-center">
                      {{
                        "از " +
                        toPersian(currentPeriod, "start_date") +
                        " تا " +
                        toPersian(currentPeriod, "end_date")
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-tab-item>
            <!-- تعریف بازه زمانی -->
            <v-tab-item class="pa-3">
              <v-form ref="newPeriod">
                <v-row dense>
                  <v-col cols="12" class="mx-auto">
                    <v-text-field
                      v-model="period.title"
                      label="عنوان بازه زمانی *"
                      :rules="[hasValue(period.title, 'عنوان بازه زمانی')]"
                    />
                  </v-col>
                  <v-col cols="6">
                    <input-date
                      v-model="period.startDate"
                      label="تاریخ شروع *"
                      :outlined="false"
                      :required="true"
                    />
                  </v-col>
                  <v-col cols="6">
                    <input-date
                      v-model="period.endDate"
                      label="تاریخ پایان *"
                      :outlined="false"
                      :required="true"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn plain :loading="loading === 'savePeriod'" @click="savePeriod">
            ذخیره
          </v-btn>
          <v-btn
            plain
            :disabled="loading === 'savePeriod'"
            @click="cancelPeriod"
          >
            انصراف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import moment from "moment-jalaali";
// import { mapState } from "vuex";
import { mapState } from "pinia";
import { usePeriodStore } from "../store/generalData";
import { useNotificationStore } from "../store/notification";
import permissionsList from "~/globals/permissions-list";
import { rules } from "~/mixins/rules";
import notification from "~/components/notification.vue";
import globals from "~/globals/globals";

export default {
  name: "DashboardLayout",
  components: { notification },
  mixins: [rules],
  middleware: ["auth", "permission"],
  data() {
    return {
      drawer: null,
      items: [
        { text: "داشبورد", icon: "mdi-view-dashboard-outline", page: "/" },
        // { text: 'ثبت اطلاعات راننده', page: '/transport/driver', hide: true },
        // { text: 'ثبت اطلاعات مالک', page: '/transport/owner', hide: true },
        // { text: 'ارزیابی راننده', icon: '', page: '/transport/evaluate', hide: true },
        {
          text: "صدور بارنامه",
          icon: "mdi-file-document-outline",
          categoryUrl: "bill-of-lading",
          items: [
            {
              text: "ورودی",
              icon: "mdi-file-download-outline",
              page: "/bill-of-lading/inputs",
            },
            {
              text: "خروجی",
              icon: "mdi-file-upload-outline",
              page: "/bill-of-lading/bulk-outputs",
            },
            {
              text: "اسکله / سایت شمال پالایشگاه",
              icon: "mdi-pier-crane",
              page: "/bill-of-lading/pier",
            },
            {
              text: "خروجی بار از سایت شمال به پالایش نفت آفتاب",
              icon: "mdi-file-send-outline",
              page: "/bill-of-lading/north-refinery-to-aor-outputs",
            },
            {
              text: "مانده قرارداد",
              icon: "mdi-file-sign",
              page: "/bill-of-lading/contract-remaining",
            },
            {
              text: "فایل های اشتراکی",
              icon: "mdi-share-variant-outline",
              page: "/bill-of-lading/share",
            },
            {
              text: "گزارش پذیرش حراست",
              icon: "mdi-timeline-text-outline",
              page: "/bill-of-lading/security-acceptance-report",
            },
            // { text: 'ورود به باسکول', icon: 'mdi-truck-delivery-outline', page: '/bill-of-lading/login-to-scale' },
            // { text: 'خروج از باسکول', icon: 'mdi-truck-delivery-outline', page: '/bill-of-lading/weighbridge-leaving', reverse: true }
          ],
        },
        {
          text: "حمل و نقل",
          icon: "mdi-truck-outline",
          categoryUrl: "transport",
          items: [
            {
              text: "رانندگان",
              icon: "mdi-account-multiple-outline",
              page: "/transport/drivers",
            },
            {
              text: "مالکان ماشین",
              icon: "mdi-account-multiple-outline",
              page: "/transport/owners",
            },
            {
              text: "ارزیابی رانندگان",
              icon: "mdi-clipboard-list-outline",
              page: "/transport/evaluation",
            },
            {
              text: "لیست پیمانکاران",
              icon: "mdi-clipboard-text-outline",
              page: "/transport/contractors",
            },
            {
              text: "تعریف امتیازدهی رانندگان",
              icon: "mdi-file-star-four-points-outline",
              page: "/transport/drivers-scoring-definition",
            },
            {
              text: "سوالات ارزیابی",
              icon: "mdi-file-question-outline",
              page: "/transport/evaluation-questions",
            },
          ],
        },
        {
          text: "حراست",
          icon: "mdi-shield-account-outline",
          categoryUrl: "security",
          items: [
            {
              text: "نوبت دهی مواد نفتی",
              icon: "mdi-calendar-clock-outline",
              page: "/security/oil-material-turning",
            },
            // {
            //   text: 'نوبت دهی متفرقه',
            //   icon: 'mdi-calendar-clock-outline',
            //   page: '/security/other-material-turning'
            // }
          ],
        },
        {
          text: "لیست منابع",
          icon: "mdi-clipboard-text-outline",
          categoryUrl: "resources",
          items: [
            {
              text: "محصولات",
              icon: "mdi-barrel-outline",
              page: "/resources/products",
            },
            {
              text: "پیمانکاران حمل",
              icon: "mdi-tanker-truck",
              page: "/resources/transport-contractors",
            },
            {
              text: "پالایشگاه ها",
              icon: "mdi-factory",
              page: "/resources/refineries",
            },
            {
              text: "مخازن مبدأ",
              icon: "mdi-database",
              page: "/resources/origin-tanks",
            },
            {
              text: "مقصد ها",
              icon: "mdi-map-marker",
              page: "/resources/destinations",
            },
            {
              text: "مخازن تخلیه",
              icon: "mdi-database",
              page: "/resources/drain-tanks",
            },
            {
              text: "خریداران",
              icon: "mdi-account-cash-outline",
              page: "/resources/buyers",
            },
          ],
        },
        {
          text: "کاربران",
          icon: "mdi-account-multiple-outline",
          page: "/users",
        },
      ],
      routes: [],
      editProfileDialog: false,
      profilePictureSrc: "",
      user: {},
      currentPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      loading: "",
      error: "",
      baseUrl: "",
      periodDialog: false,
      periodDialogActiveTab: 0,
      periods: [],
      currentPeriod: "",
      period: {
        title: "",
        startDate: "",
        endDate: "",
      },
      showPassword: false,
      userRoles: [
        "admin",
        "weighbridgeAdmin",
        "weighbridgeUser",
        "transportOperation",
        "transportManager",
        "statistics&InformationUser",
      ],
      route: useRoute(),
    };
  },
  computed: {
    pageTitle() {
      const findItem = (items) => {
        for (const item of items) {
          if (item.page === this.route.path) {
            return item.text;
          }
          if (item.items) {
            const found = findItem(item.items);
            if (found) {
              return found;
            }
          }
        }
      };
      return findItem(this.items);
    },
    menuItems() {
      const filterItems = (items) => {
        return items.reduce((result, item) => {
          if ((this.routes.includes(item.page) && !item.hide) || item.items) {
            if (item.items) {
              item.items = filterItems(item.items);
            }
            result.push(item);
          }
          return result;
        }, []);
      };
      return filterItems(this.items);
    },
    showPeriod() {
      const USER = this.$cookies.get("auth");
      return this.userRoles.includes(USER.user.role);
    },
    userPermission() {
      return ["weighbridgeAdmin", "admin"].includes(
        this.$cookies.get("auth").user.role,
      );
    },
    // ...mapState({
    //   notifications: (state) => state.notification.notifications,
    // }),
    ...mapState(useNotificationStore, ["notifications"]),
  },
  watch: {
    "route.path": {
      deep: true,
      handler() {
        this.$store.commit("notification/removeAllNotifications");
      },
    },
  },
  created() {
    console.log("$vuetify", this.$vuetify);
    // const USER_ROLE = this.$cookies.get("auth").user.role;
    const auth = useCookie("auth");
    const USER_ROLE = auth.value.user.role;

    this.baseUrl = globals.baseUrl();

    this.user = auth.value.user;

    this.getPeriods();

    Object.entries(permissionsList).forEach(([url, roles]) => {
      if (
        roles.includes(USER_ROLE) ||
        USER_ROLE === "admin" ||
        roles.includes("*")
      ) {
        this.routes.push(url);
      }
    });
    moment.loadPersian({ usePersianDigits: false });
  },
  mounted() {
    const auth = useCookie("auth");
    // console.log(this.$vuetify)
    if (
      auth.value.user_meta?.darkMode === false ||
      auth.value.user_meta?.darkMode === "false"
    ) {
      this.$vuetify.theme.dark = false;
    } else {
      this.$vuetify.theme.dark = true;
    }
  },
  methods: {
    logout() {
      this.$axios
        .delete("api/logout", {
          params: {
            id: this.$cookies.get("auth").user.id,
          },
        })
        .finally(() => {
          this.$cookies.remove("auth");
          this.$router.push("/login");
        });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      const CURRENT_DATA = this.$cookies.get("auth");
      CURRENT_DATA.user_meta.darkMode = this.$vuetify.theme.dark;
      this.$cookies.set("auth", CURRENT_DATA, {
        path: "/",
        maxAge: 28800,
      });
      const DATA = {
        userId: this.user.id,
        metaKey: "darkMode",
        metaValue: this.$vuetify.theme.dark ? "true" : "false",
      };
      this.$axios.post("api/userMeta", DATA);
    },
    editProfile() {
      this.editProfileDialog = true;
      if (this.user.profile_picture) {
        this.profilePictureSrc =
          this.baseUrl + "profile_pictures/" + this.user.id + ".jpg";
      }
      this.password = null;
      this.newPassword = null;
      this.repeatNewPassword = null;
    },
    openSelectProfilePicture() {
      this.$refs.input.click();
    },
    setProfilePicture() {
      if (this.$refs.input.files[0]) {
        const fileReader = new FileReader();
        const file = this.$refs.input.files[0];
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          this.profilePictureSrc = fileReader.result;
        };
      }
    },
    saveProfile() {
      const REQUESTS = [];
      let profilePictureChanged = false;
      if (this.$refs.input.files[0]) {
        const PROFILE_PICTURE_FORM = new FormData();
        PROFILE_PICTURE_FORM.append(
          "userId",
          this.$cookies.get("auth").user.id,
        );
        PROFILE_PICTURE_FORM.append("picture", this.$refs.input.files[0]);
        REQUESTS.push(
          this.$axios
            .post("/api/setProfilePicture", PROFILE_PICTURE_FORM, {
              "Content-Type": "multipart/form-data",
            })
            .then(() => {
              profilePictureChanged = true;
            }),
        );
      }
      if (this.showPassword) {
        if (this.$refs.profileForm.validate()) {
          REQUESTS.push(
            this.$axios
              .put("/api/changePassword", {
                username: this.user.username,
                currentPassword: this.currentPassword,
                newPassword: this.newPassword,
              })
              .then(() => {
                this.editProfileDialog = false;
              }),
          );
        }
      }
      if (this.$refs.profileForm.validate()) {
        this.loading = "save";
        Promise.all([...REQUESTS])
          .then(() => {
            this.editProfileDialog = false;
            if (profilePictureChanged) {
              location.reload();
            }
            this.showPassword = false;
          })
          .finally(() => {
            this.loading = "";
          });
      }
    },
    cancelProfileDialog() {
      this.currentPassword = "";
      this.newPassword = "";
      this.repeatNewPassword = "";
      this.editProfileDialog = false;
      this.showPassword = false;
    },
    passwordLength(password) {
      if (password && password.length < 6) {
        return "رمز عبور نمی تواند کمتر از 6 کاراکتر باشد!";
      } else {
        return true;
      }
    },
    repeatNewPasswordCheck() {
      if (this.repeatNewPassword === this.newPassword) {
        return true;
      } else {
        return "رمز های عبور جدید یکسان نیستند!";
      }
    },
    checkUrl(categoryUrl) {
      if (this.route.fullPath.split("/")[1] === categoryUrl) {
        return true;
      }
    },
    getPeriods() {
      const auth = useCookie("auth");
      const store = usePeriodStore();
      const DATA = store.periods;

      if (DATA.length === 0) {
        this.$axios.get("/api/archivePeriods").then((res) => {
          //   this.$store.commit("generalData/setPeriods", res.data);
          store.setPeriods(res.data);
          this.periods = [...DATA];

          if (auth.value.user_meta?.period) {
            this.currentPeriod = parseInt(auth.value.user_meta.period);
          } else {
            this.currentPeriod = this.periods[0];
          }
        });
      } else {
        this.periods = [...DATA];
      }
    },
    openPeriodDialog() {
      this.periodDialog = true;
      if (this.$cookies.get("auth").user_meta.period) {
        this.currentPeriod = this.periods.find(
          (p) => p.id === parseInt(this.$cookies.get("auth").user_meta.period),
        )?.id;
      } else {
        this.currentPeriod = this.periods[0].id;
      }
    },
    savePeriod() {
      if (this.periodDialogActiveTab === 0) {
        if (this.$refs.currentPeriod.validate()) {
          this.loading = "savePeriod";
          const DATA = {
            userId: this.user.id,
            metaKey: "period",
            metaValue: this.currentPeriod,
          };
          this.$axios
            .post("api/userMeta", DATA)
            .then(() => {
              const CURRENT_DATA = this.$cookies.get("auth");
              CURRENT_DATA.user_meta.period = this.currentPeriod;
              this.$cookies.set("auth", CURRENT_DATA, {
                path: "/",
                maxAge: 28800,
              });
              this.periodDialog = false;
            })
            .finally(() => {
              this.loading = "";
            });
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.$refs.newPeriod.validate()) {
          this.loading = "savePeriod";
          const DATA = { ...this.period };
          DATA.startDate = moment(
            this.period.startDate,
            "jYYYY/jMM/jDD",
          ).format("YYYY-MM-DD");
          DATA.endDate = moment(this.period.endDate, "jYYYY/jMM/jDD").format(
            "YYYY-MM-DD",
          );
          this.$axios
            .post("/api/period", DATA)
            .then((res) => {
              this.periods.push(res.data);
              this.cancelPeriod();
            })
            .finally(() => {
              this.loading = "";
            });
        }
      }
    },
    cancelPeriod() {
      if (this.$refs.newPeriod) {
        this.$refs.newPeriod.reset();
      }
      this.period.startDate = "";
      this.period.endDate = "";
      this.periodDialog = false;
      this.periodDialogActiveTab = 0;
    },
    toPersian(id, dateType) {
      const CURRENT_DATA =
        dateType === "start_date"
          ? this.periods.find((p) => p.id === id)?.start_date
          : this.periods.find((p) => p.id === id)?.end_date;
      return moment(CURRENT_DATA).format("jYYYY/jMM/jDD");
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.navigationDrawer .v-navigation-drawer__content {
  overflow-y: hidden !important;
}
.vList {
  height: 80vh;
}
.darkMainBg {
  background-color: #151515;
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
.plaque {
  direction: ltr;
  unicode-bidi: bidi-override;
}

/* .{
      background-color: #335c99;
    } */

.v-main__wrap {
  position: relative;
}
</style>

<style scoped>
.z-500 {
  /* z-index: 200; */
}
.floating-drawer {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 11;
}
</style>

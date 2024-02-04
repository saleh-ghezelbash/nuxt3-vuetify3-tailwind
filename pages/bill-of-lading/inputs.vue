<template>
  <div>
    <template v-if="!newEdit">
      <v-card elevation="5">
        <v-card-item color="primary">
          <v-card-title class="pa-3" color="primary">
            <div>فیلترها</div>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-form ref="form" :disabled="loading === 'get'">
            <v-row class="mt-5">
              <v-col cols="2">
                <inputDate
                  v-model="startDate"
                  label="تاریخ دیپ شروع"
                  :clearable="true"
                  :picker="true"
                  @keyup.enter="getReport"
                  @input="(e) => (startDate = e)"
                />
              </v-col>
              <v-col cols="2">
                <inputDate
                  v-model="endDate"
                  label="تاریخ دیپ پایان"
                  :clearable="true"
                  :picker="true"
                  @keyup.enter="getReport"
                  @input="(e) => (endDate = e)"
                />
              </v-col>
              <v-col cols="2">
                <v-autocomplete
                  v-model="product"
                  label="محصول"
                  :items="products"
                  item-text="title"
                  item-value="id"
                  return-object
                  clearable
                  @keyup.enter="getReport"
                  @change="origin = ''"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="exchangeContractNumber"
                  label="شماره قرارداد بورس"
                  clearable
                  @keyup.enter="getReport"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="remittanceNumber"
                  label="شماره حواله"
                  clearable
                  @keyup.enter="getReport"
                />
              </v-col>
              <v-col cols="2">
                <v-autocomplete
                  v-model="origin"
                  label="مبدأ"
                  :items="refineries"
                  item-text="title"
                  item-value="id"
                  clearable
                  @keyup.enter="getReport"
                />
              </v-col>
              <v-col cols="3">
                <v-card elevation="0">
                  <v-card-subtitle class="mt-n9">
                    وزن خالص پالایشگاه
                  </v-card-subtitle>
                  <v-card-text class="mt-n8">
                    <v-row dense class="tw-pt-2.5">
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="refineryNetWeightMin"
                          label="حداقل"
                          type="number"
                          min="0"
                          :rules="[
                            checkLessThan(
                              refineryNetWeightMin,
                              refineryNetWeightMax,
                            ),
                          ]"
                          clearable
                          @keyup.enter="getReport"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="refineryNetWeightMax"
                          label="حداکثر"
                          type="number"
                          min="0"
                          clearable
                          @keyup.enter="getReport"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="3">
                <v-card elevation="0">
                  <v-card-subtitle class="mt-n9"> وزن تخلیه </v-card-subtitle>
                  <v-card-text class="mt-n8">
                    <v-row dense class="tw-pt-2.5">
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="emptyWeightMin"
                          label="حداقل"
                          type="number"
                          min="0"
                          :rules="[
                            checkLessThan(emptyWeightMin, emptyWeightMax),
                          ]"
                          clearable
                          @keyup.enter="getReport"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="emptyWeightMax"
                          label="حداکثر"
                          type="number"
                          min="0"
                          clearable
                          @keyup.enter="getReport"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="2">
                <v-autocomplete
                  v-model="tankName"
                  label="مخزن تخلیه"
                  :items="drainTanks"
                  item-text="title"
                  item-value="id"
                  clearable
                  @keyup.enter="getReport"
                />
              </v-col>
              <v-col
                v-if="userRole === 'admin' || userRole === 'weighbridgeAdmin'"
                cols="2"
              >
                <v-autocomplete
                  v-model="billOfLadingUser"
                  label="ثبت کننده"
                  :items="billOfLadingUsers"
                  item-text="name"
                  item-value="id"
                  clearable
                  @keyup.enter="getReport"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="row"
                  label="ردیف"
                  type="number"
                  min="1"
                  clearable
                  @keyup.enter="getReport"
                />
              </v-col>
              <v-col cols="2">
                <!-- <number-plate v-if="showPlaque" v-model="plaque" /> -->
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
      <div
        class="tw-flex tw-flex-row-reverse my-n5 tw-px-4 tw-gap-x-4 tw-text-end"
      >
        <v-btn
          fab
          bottom
          small
          color="primary"
          dark
          icon="mdi-magnify"
          :loading="searchLoading"
          @click="getReport(null, true)"
        >
        </v-btn>

        <v-btn
          fab
          bottom
          small
          color="green darken-3"
          dark
          icon="mdi-microsoft-excel"
          :loading="loading === 'excel'"
          @click="excelReport(null)"
        >
        </v-btn>

        <v-btn
          fab
          bottom
          small
          color="warning darken-1"
          dark
          icon="mdi-file-document-refresh-outline"
          :loading="loading === 'excel'"
          @click="clearFilter"
        >
        </v-btn>
      </div>
      <v-card class="mt-10" elevation="5">
        <v-card-title class="primary tw-text-white pa-3" color="primary">
          نتیجه جستجو
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-model="vmData"
            v-model:options="tableOptions"
            :headers="headers"
            :items="mainData"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 20, 50],
            }"
            :server-items-length="serverItemsLength"
            :show-select="userRole !== 'statistics&InformationUser'"
            select-strategy="single"
            item-key="id"
            :loading="loading === 'get'"
            return-object
            @update:options="tablePageChange"
            @update:currentItems="(e) => console.log('currentItems', e)"
          >
            <template #item.truck_number="{ item }">
              <div class="plaque tw-text-right">
                {{
                  item.truck_number.slice(0, 6) +
                  " " +
                  item.truck_number.slice(6, 8)
                }}
              </div>
            </template>
            <template #item.product="{ item }">
              {{
                products.find((product) => product.id === item.product)?.title
              }}
            </template>
            <template #item.user="{ item }">
              {{
                billOfLadingUsers.find((user) => user.id === item.user)?.name
              }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <!-- دیالوگ حذف -->
      <v-dialog v-model="deleteDialog" persistent width="500">
        <v-card>
          <v-card-title>
            <span>{{ "حذف اطلاعات" }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col> آیا از حذف اطلاعات اطمینان دارید؟ </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn plain :loading="loading === 'delete'" @click="deleteData">
              بله
            </v-btn>
            <v-btn plain :disabled="loading === 'delete'" @click="closeDialog">
              خیر
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div
        v-if="userRole !== 'statistics&InformationUser'"
        class="tw-flex tw-flex-row-reverse mt-n5 tw-px-4 tw-gap-x-4"
      >
        <v-btn
          :disabled="resourcesLoading"
          fab
          bottom
          small
          color="primary"
          dark
          icon="mdi-plus"
          class="mb-5"
          @click="newData"
        >
        </v-btn>

        <v-btn
          fab
          bottom
          small
          color="orange"
          dark
          icon="mdi-pencil"
          class="mb-5"
          @click="editData"
        >
        </v-btn>

        <v-btn
          fab
          bottom
          small
          color="red"
          dark
          icon="mdi-delete"
          class="mb-5"
          @click="openDeleteDialog"
        >
        </v-btn>

        <v-btn
          fab
          bottom
          small
          icon="mdi-delete-restore"
          color="success"
          class="mb-5 ml-auto"
          @click="recoveryData"
        >
        </v-btn>
      </div>
    </template>
    <billOfLadingInput
      v-else
      :id="editId"
      :resources="{
        products,
        origins,
        transportContractors,
        drainTanks,
        originTanks,
        destinations,
        buyers,
        sendStatuses,
      }"
      @back="closeNewEdit"
    />
    <!-- <recovery
      v-if="openRecoveryDialog"
      url="api/weighbridgeInputRecoveryData"
      :headers="headers"
      @close="openRecoveryDialogHandler"
    /> -->
  </div>
</template>

<script>
// import moment from "moment-jalaali";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
// import VueDatePicker from "@vuepic/vue-datepicker";
import { rules } from "../../mixins/rules";
// import Vue3PersianDatetimePicker from "~/components/picker/Vue3PersianDatetimePicker";
// import globals from "~/globals/globals";
import billOfLadingInput from "~/components/billOfLading/input.vue";
import { useNotificationStore } from "~/store/notification";
// import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    billOfLadingInput,
    // Vue3PersianDatetimePicker,
    // VueDatePicker,
  },
  mixins: [rules],
  layout: "dashboard",
  data() {
    return {
      headers: [
        { title: "ردیف", key: "row" },
        { title: "محصول", key: "product" },
        { title: "شماره ماشین", key: "truck_number" },
        { title: "وزن خالص مبدأ", key: "refinery_net_weight" },
        { title: "خواب بین مسیر", key: "tanker_sleep_during_road" },
        { title: "وضعیت", key: "discharge_status" },
        { title: "خواب کلی", key: "total_sleep" },
        {
          title: "شماره بارنامه خروجی",
          key: "outbound_bill_of_lading_number",
        },
        { title: "ثبت کننده", key: "user" },
      ],
      mainData: [],
      apiData: {},
      vmData: [],
      tableOptions: {
        page: 1,
        itemsPerPage: 5,
        currentPage: 1,
      },
      currentItemsPerPage: 5,
      serverItemsLength: 0,
      resourcesList: [],
      products: [],
      origins: [],
      transportContractors: [],
      drainTanks: [],
      originTanks: [],
      destinations: [],
      buyers: [],
      // sendStatuses: [],
      startDate: "",
      endDate: "",
      product: "",
      exchangeContractNumber: "",
      remittanceNumber: "",
      origin: "",
      refineryNetWeightMin: "",
      refineryNetWeightMax: "",
      emptyWeightMin: "",
      emptyWeightMax: "",
      tankName: "",
      billOfLadingUser: "",
      billOfLadingUsers: [],
      // usersLoading: true,
      row: "",
      loading: "",
      searchLoading: false,
      deleteDialog: false,
      username: "",
      userRole: "",
      excelData: [],
      lastPageIndex: null,
      currentIndex: 1,
      plaque: "",
      newEdit: false,
      editId: null,
      resourcesLoading: true,
      openRecoveryDialog: false,
      sendStatuses: [
        {
          id: 1,
          title: "ارسال از شهرستان - سایت شمال پالایشگاه - E",
        },
        {
          id: 2,
          title: "ارسال از شهرک صنعتی - سایت شمال پالایشگاه - E",
        },
        {
          id: 3,
          title: "ارسال از شهرک صنعتی",
        },
        {
          id: 4,
          title: "ارسال از شهرستان",
        },
      ],
      showPlaque: true,
      datePickerModel: "",
    };
  },
  computed: {
    refineries() {
      const REFINERIES = [];
      const PRODUCT_REFINERIES = this.product?.id
        ? JSON.parse(this.product.refineries)
        : [];
      PRODUCT_REFINERIES.forEach((refinery) => {
        REFINERIES.push(
          this.origins.find((origin) => {
            return origin.id === refinery;
          }),
        );
      });
      return REFINERIES;
    },
  },
  created() {
    // console.log("refs:", this.$refs);
    definePageMeta({
      layout: "dashboard",
    });
    this.getResources();
    const auth = useCookie("auth");
    this.username = auth.value.user.username;
    this.userRole = auth.value.user.role;
  },
  methods: {
    getResources() {
      const { $axios } = useNuxtApp();
      $axios
        .get("/api/weighbridgeInputResources")
        .then((res) => {
          this.products = res.data.products;
          this.origins = res.data.refineries;
          this.transportContractors = res.data.transport_contractors;
          this.drainTanks = res.data.drain_tanks;
          this.originTanks = res.data.origin_tanks;
          this.destinations = res.data.destinations;
          this.buyers = res.data.buyers;
          this.billOfLadingUsers = res.data.bill_of_lading_users;
        })
        .finally(() => {
          this.resourcesLoading = false;
        });
    },
    getReport(pageUrl = null, search) {
      // console.log(pageUrl, search);
      // if (this.$refs.form.validate()) {
      this.loading = "get";
      if (search) {
        this.searchLoading = true;
      }
      this.mainData = [];
      this.vmData = [];
      const { $axios } = useNuxtApp();
      const auth = useCookie("auth");
      // $axios.setHeader("Period", auth.value.user_meta.period);
      $axios
        .get(
          "/api/weighbridgeInputReport?page=" + pageUrl ||
            "/api/weighbridgeInputReport",
          {
            params: {
              startDate: this.startDate,
              endDate: this.endDate,
              product: this.product?.id,
              truckNumber: this.plaque,
              exchangeContractNumber: this.exchangeContractNumber,
              remittanceNumber: this.remittanceNumber,
              origin: this.origin,
              refineryNetWeightMin: this.refineryNetWeightMin
                ? this.refineryNetWeightMin
                : 0,
              refineryNetWeightMax: this.refineryNetWeightMax
                ? this.refineryNetWeightMax
                : 0,
              factoryEmptyWeightMin: this.emptyWeightMin
                ? this.emptyWeightMin
                : 0,
              factoryEmptyWeightMax: this.emptyWeightMax
                ? this.emptyWeightMax
                : 0,
              drainTankName: this.tankName,
              billOfLadingUser: this.billOfLadingUser,
              row: this.row,
              rowsPerPage: this.tableOptions.itemsPerPage,
              // sortBy: this.tableOptions.sortBy[0],
              // asc: this.tableOptions.sortDesc[0] ? "desc" : "asc",
            },
            headers: {
              Period: auth.value.user_meta.period,
            },
          },
        )
        .then((res) => {
          this.mainData = res.data.data;
          this.serverItemsLength = res.data.total;
          if (!pageUrl) {
            this.tableOptions.currentPage = 1;
            this.tableOptions.page = 1;
          }
        })
        .finally(() => {
          this.loading = "";
          this.searchLoading = false;
        });
      // }
    },
    excelReport(link = null) {
      console.log(link);
      // if (this.$refs.form.validate()) {
      //   this.loading = "excel";
      // const { $axios } = useNuxtApp();
      //   $axios.setHeader(
      //     "Period",
      //     this.$cookies.get("auth").user_meta.period,
      //   );
      //   $axios
      //     .get(!link ? "/api/weighbridgeInputExportExcel" : link, {
      //       params: {
      //         startDate: this.startDate,
      //         endDate: this.endDate,
      //         product: this.product,
      //         truckNumber: this.plaque,
      //         exchangeContractNumber: this.exchangeContractNumber,
      //         remittanceNumber: this.remittanceNumber,
      //         origin: this.origin,
      //         refineryNetWeightMin: this.refineryNetWeightMin
      //           ? this.refineryNetWeightMin
      //           : 0,
      //         refineryNetWeightMax: this.refineryNetWeightMax
      //           ? this.refineryNetWeightMax
      //           : 0,
      //         factoryEmptyWeightMin: this.emptyWeightMin
      //           ? this.emptyWeightMin
      //           : 0,
      //         factoryEmptyWeightMax: this.emptyWeightMax
      //           ? this.emptyWeightMax
      //           : 0,
      //         drainTankName: this.tankName,
      //         billOfLadingUser: this.billOfLadingUser,
      //         row: this.row,
      //       },
      //     })
      //     .then((res) => {
      //       this.excelData = [];
      //       // res.data.data.forEach((item) => {
      //       res.data.forEach((item) => {
      //         // switch (item.shift) {
      //         //   case 'morning':
      //         //     item.shift = 'صبح'
      //         //     break
      //         //   case 'afternoon':
      //         //     item.shift = 'عصر'
      //         //     break
      //         //   case 'night':
      //         //     item.shift = 'شب'
      //         //     break
      //         // }
      //         item.product = this.products.find(
      //           (product) => product.id === item.product,
      //         )?.title;
      //         item.buyer = this.buyers.find(
      //           (resource) => resource.id === item.buyer,
      //         )?.title;
      //         item.origin = this.origins.find(
      //           (resource) => resource.id === item.origin,
      //         )?.title;
      //         item.transport_contractor = this.transportContractors.find(
      //           (resource) => resource.id === item.transport_contractor,
      //         )?.title;
      //         item.drain_tank_name = this.drainTanks.find(
      //           (resource) => resource.id === item.drain_tank_name,
      //         )?.title;
      //         item.origin_tank = this.originTanks.find(
      //           (resource) => resource.id === item.origin_tank,
      //         )?.title;
      //         item.send_status = this.sendStatuses.find(
      //           (resource) => resource.id === item.send_status,
      //         )?.title;

      //         item.truckPlaque =
      //           item.truck_number.slice(0, 2) + item.truck_number.slice(3, 6);
      //         item.truckPlaque2 = item.truck_number.slice(6, 8);

      //         item.deepDateYear = item.deep_date.slice(0, 4);
      //         item.deepDateMonth = item.deep_date.slice(5, 7);
      //         item.deepDateDay = item.deep_date.slice(8, 10);

      //         item.refineryEnteringDateYear =
      //           item.refinery_entering_date?.slice(0, 4);
      //         item.refineryEnteringDateMonth =
      //           item.refinery_entering_date?.slice(5, 7);
      //         item.refineryEnteringDateDay = item.refinery_entering_date?.slice(
      //           8,
      //           10,
      //         );

      //         item.refineryLeavingDateYear = item.refinery_leaving_date?.slice(
      //           0,
      //           4,
      //         );
      //         item.refineryLeavingDateMonth = item.refinery_leaving_date?.slice(
      //           5,
      //           7,
      //         );
      //         item.refineryLeavingDateDay = item.refinery_leaving_date?.slice(
      //           8,
      //           10,
      //         );

      //         item.securityAppointmentDateYear =
      //           item.security_appointment_date?.slice(0, 4);
      //         item.securityAppointmentDateMonth =
      //           item.security_appointment_date?.slice(5, 7);
      //         item.securityAppointmentDateDay =
      //           item.security_appointment_date?.slice(8, 10);

      //         item.weighbridgeEnteringDateYear =
      //           item.weighbridge_entering_date?.slice(0, 4);
      //         item.weighbridgeEnteringDateMonth =
      //           item.weighbridge_entering_date?.slice(5, 7);
      //         item.weighbridgeEnteringDateDay =
      //           item.weighbridge_entering_date?.slice(8, 10);

      //         item.weighbridgeLeavingDateYear =
      //           item.weighbridge_leaving_date?.slice(0, 4);
      //         item.weighbridgeLeavingDateMonth =
      //           item.weighbridge_leaving_date?.slice(5, 7);
      //         item.weighbridgeLeavingDateDay =
      //           item.weighbridge_leaving_date?.slice(8, 10);

      //         item.fullWeightDifference =
      //           item.factory_full_weight - item.refinery_full_weight;
      //         item.factoryWeightVSOriginWeightDifference =
      //           item.factory_net_weight - item.refinery_net_weight;
      //         moment.loadPersian({ usePersianDigits: false });
      //         // خواب مبدأ + خواب مقصد
      //         const SUM_AS_MILLISECONDS = moment
      //           .duration(item.origin_sleep)
      //           .add(item.total_sleep)
      //           .as("milliseconds");
      //         const HOURS = Math.floor(
      //           moment.duration(SUM_AS_MILLISECONDS).as("hours"),
      //         );
      //         const MINUTES =
      //           moment.duration(SUM_AS_MILLISECONDS).as("minutes") % 60;
      //         item.originPlusDestinationSleep =
      //           (HOURS < 10 ? "0" + HOURS : HOURS) +
      //           ":" +
      //           (MINUTES < 10 ? "0" + MINUTES : MINUTES);
      //         // خواب ورود به باسکول تا خروج از باسکول
      //         const ENTERING =
      //           item.weighbridge_entering_date +
      //           "T" +
      //           item.weighbridge_entering_time +
      //           ":00";
      //         const LEAVING =
      //           item.weighbridge_leaving_date +
      //           "T" +
      //           item.weighbridge_leaving_time +
      //           ":00";
      //         item.weighbridgeSleep = globals.timeDifference(LEAVING, ENTERING);
      //         // خواب اعلام به آزمایشگاه تا زمان نمونه گیری
      //         const START =
      //           "01/01/01T" + item.laboratory_announcement_time + ":00";
      //         const END = "01/01/01T" + item.sampling_time + ":00";
      //         item.laboratoryAnnouncementUntilSamplingSleep =
      //           globals.timeDifference(END, START);

      //         if (item.pier_data) {
      //           item.destinationFullWeight = item.pier_data.pier_full_weight;
      //           item.destinationEmptyWeight = item.pier_data.pier_empty_weight;
      //           item.destinationNetWeight = item.pier_data.pier_net_weight;
      //           item.destinationExitDateYear =
      //             item.pier_data.pier_exit_date.slice(0, 4);
      //           item.destinationExitDateMonth =
      //             item.pier_data.pier_exit_date.slice(5, 7);
      //           item.destinationExitDateDay =
      //             item.pier_data.pier_exit_date.slice(8, 10);
      //           item.destinationExitDate = item.pier_data.pier_exit_date;
      //           item.destinationExitTime = item.pier_data.pier_exit_time;
      //           item.onTheWaySleep = item.pier_data.routes_duration;
      //           item.destinationSleep = item.pier_data.pier_sleep;
      //           item.totalSleep = item.pier_data.total_sleep;
      //           item.refineryWeightAndDestinationWeightDifference =
      //             item.pier_data.pier_net_weight - item.refinery_net_weight;
      //           item.tanker = this.drainTanks.find(
      //             (resource) => resource.id === item.pier_data.drain_tank,
      //           )?.title;
      //           item.pierProduct = this.products.find(
      //             (resource) => resource.id === item.pier_data.product,
      //           )?.title;
      //           item.pierNetWeight = item.pier_data.pier_net_weight;
      //           if (item.discharge_status === "E") {
      //             const ENTERING =
      //               item.security_appointment_date +
      //               "T" +
      //               item.security_appointment_time +
      //               ":00";
      //             const LEAVING =
      //               item.destinationExitDate +
      //               "T" +
      //               item.destinationExitTime +
      //               ":00";
      //             item.EStatusSleep = globals.timeDifference(LEAVING, ENTERING);

      //             const SUM_AS_MILLISECONDS = moment
      //               .duration(item.origin_sleep)
      //               .add(item.EStatusSleep)
      //               .as("milliseconds");
      //             const HOURS = Math.floor(
      //               moment.duration(SUM_AS_MILLISECONDS).as("hours"),
      //             );
      //             const MINUTES =
      //               moment.duration(SUM_AS_MILLISECONDS).as("minutes") % 60;
      //             item.EOriginPlusDestinationSleep =
      //               (HOURS < 10 ? "0" + HOURS : HOURS) +
      //               ":" +
      //               (MINUTES < 10 ? "0" + MINUTES : MINUTES);
      //           }
      //         }
      //         if (item.bulk_output_data) {
      //           item.bulkoutputWeighbridgeLeavingDate =
      //             item.bulk_output_data.weighbridge_leaving_date;
      //         }
      //         item.productPlusRefinery = item.product + " - " + item.origin;
      //         // item.fleet = ''
      //         this.excelData.push(item);
      //       });
      //       // if (!this.lastPageIndex) {
      //       //   this.lastPageIndex = res.data.last_page
      //       // }
      //       // else {
      //       //   this.exportExcel(this.excelData)
      //       // }
      //     })
      //     .finally(async () => {
      //       // if (this.currentIndex < this.lastPageIndex) {
      //       // this.currentIndex++
      //       await this.exportExcel(this.excelData);
      //       // this.excelReport('/api/weighbridgeInputExportExcel?page=' + this.currentIndex)
      //       // }
      //       // if (this.currentIndex === this.lastPageIndex) {
      //       // }
      //     });
      // }
    },
    exportExcel(data) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("input", {
        pageSetup: { paperSize: 9, orientation: "landscape" },
      });
      worksheet.views = [
        { rightToLeft: true, state: "frozen", ySplit: 1, topLeftCell: "A1" },
      ];
      worksheet.columns = [
        { header: "ردیف", key: "row", width: 9 },
        { header: "روز", key: "deepDateDay", width: 4 },
        { header: "ماه", key: "deepDateMonth", width: 4 },
        { header: "سال", key: "deepDateYear", width: 8 },
        { header: "تاریخ دیپ", key: "deep_date", width: 16 },
        { header: "شیفت", key: "shift", width: 10 },
        { header: "ثبت کننده", key: "user", width: 18 },
        { header: "محصول", key: "product", width: 20 },
        { header: "شماره حواله", key: "remittance_number", width: 20 },
        {
          header: "شماره قرارداد بورس",
          key: "exchange_contract_number",
          width: 20,
        },
        { header: "خریدار", key: "buyer", width: 20 },
        { header: "مبدأ", key: "origin", width: 20 },
        { header: "شماره ماشین", key: "truckPlaque", width: 15 },
        { header: "ایران", key: "truckPlaque2", width: 5 },
        { header: "شماره تانکر", key: "tanker_number", width: 15 },
        { header: "نام راننده", key: "driver", width: 20 },
        { header: "پیمانکار حمل", key: "transport_contractor", width: 20 },
        { header: "روز", key: "refineryEnteringDateDay", width: 4 },
        { header: "ماه", key: "refineryEnteringDateMonth", width: 4 },
        { header: "سال", key: "refineryEnteringDateYear", width: 8 },
        {
          header: "تاریخ ورود به مبدأ",
          key: "refinery_entering_date",
          width: 20,
        },
        { header: "روز", key: "refineryLeavingDateDay", width: 4 },
        { header: "ماه", key: "refineryLeavingDateMonth", width: 4 },
        { header: "سال", key: "refineryLeavingDateYear", width: 8 },
        {
          header: "تاریخ خروج از مبدأ",
          key: "refinery_leaving_date",
          width: 20,
        },
        {
          header: "ساعت ورود به مبدأ",
          key: "refinery_entering_time",
          width: 15,
        },
        {
          header: "ساعت خروج از مبدأ",
          key: "refinery_leaving_time",
          width: 15,
        },
        { header: "خواب بارگیری مبدأ", key: "origin_sleep", width: 15 },
        { header: "وزن پر پالایشگاه", key: "refinery_full_weight", width: 15 },
        {
          header: "وزن خالی پالایشگاه",
          key: "refinery_empty_weight",
          width: 15,
        },
        {
          header: "وزن خالص پالایشگاه / گمرک",
          key: "refinery_net_weight",
          width: 15,
        },
        { header: "محور / پتروآموت", key: "mehvar_petro", width: 15 },
        { header: "مقدار به لیتر", key: "value_in_liters", width: 15 },
        { header: "مقدار 60 درجه", key: "sixty_degree_value", width: 15 },
        { header: "وزن مخصوص", key: "special_weight", width: 15 },
        { header: "شماره بارنامه", key: "bill_of_lading_number", width: 20 },
        {
          header: "کرایه بارنامه پلیس راهی",
          key: "police_bill_of_lading_fare",
          width: 20,
        },
        { header: "روز", key: "securityAppointmentDateDay", width: 5 },
        { header: "ماه", key: "securityAppointmentDateMonth", width: 5 },
        { header: "سال", key: "securityAppointmentDateYear", width: 8 },
        {
          header: "تاریخ نوبت دهی حراست",
          key: "security_appointment_date",
          width: 15,
        },
        {
          header: "ساعت نوبت دهی حراست",
          key: "security_appointment_time",
          width: 15,
        },
        { header: "خواب بین مسیر", key: "tanker_sleep_during_road", width: 15 },
        // { header: 'ساعت اعلام به آزمایشگاه', key: 'laboratory_announcement_time', width: 15 },
        // { header: 'ساعت نمونه گیری', key: 'sampling_time', width: 15 },
        { header: "مخزن بارگیری", key: "origin_tank", width: 15 },
        {
          header: "ساعت اعلام جواب آزمایش",
          key: "laboratory_ansewr_announcement_time",
          width: 15,
        },
        { header: "نام مخزن تخلیه", key: "drain_tank_name", width: 15 },
        {
          header: "خواب اعلام به آزمایشگاه تا زمان نمونه گیری",
          key: "laboratoryAnnouncementUntilSamplingSleep",
          width: 15,
        },
        {
          header: "خواب جواب آزمایشگاه",
          key: "sleep_time_announcement_to_laboratory_until_delivery",
          width: 15,
        },
        { header: "روز", key: "weighbridgeEnteringDateDay", width: 5 },
        { header: "ماه", key: "weighbridgeEnteringDateMonth", width: 5 },
        { header: "سال", key: "weighbridgeEnteringDateYear", width: 8 },
        {
          header: "تاریخ ورود به باسکول",
          key: "weighbridge_entering_date",
          width: 15,
        },
        { header: "روز", key: "weighbridgeLeavingDateDay", width: 5 },
        { header: "ماه", key: "weighbridgeLeavingDateMonth", width: 5 },
        { header: "سال", key: "weighbridgeLeavingDateYear", width: 8 },
        {
          header: "تاریخ خروج از باسکول",
          key: "weighbridge_leaving_date",
          width: 15,
        },
        {
          header: "ساعت ورود به باسکول",
          key: "weighbridge_entering_time",
          width: 15,
        },
        {
          header: "ساعت خروج از باسکول",
          key: "weighbridge_leaving_time",
          width: 15,
        },
        {
          header: "خواب از زمان جواب دهی تا ورود به باسکول",
          key: "sleeping_time_from_answering_until_weighbridge_entering",
          width: 15,
        },
        {
          header: "خواب ورود به باسکول تا خروج از باسکول",
          key: "weighbridgeSleep",
          width: 15,
        },
        {
          header: "خواب تخلیه (از  زمان نوبت دهی حراست تا خروج از باسکول)",
          key: "total_sleep",
          width: 15,
        },
        {
          header: "خواب مبدأ + خواب مقصد (وضعیت T)",
          key: "originPlusDestinationSleep",
          width: 15,
        },
        { header: "وزن پر کارخانه", key: "factory_full_weight", width: 15 },
        { header: "وزن خالی کارخانه", key: "factory_empty_weight", width: 15 },
        { header: "وزن خالص کارخانه", key: "factory_net_weight", width: 15 },
        { header: "وضعیت ارسال", key: "send_status", width: 35 },
        { header: "تفاضل وزن پر", key: "fullWeightDifference", width: 15 },
        {
          header: "تفاضل وزن کارخانه با وزن مبدأ",
          key: "factoryWeightVSOriginWeightDifference",
          width: 15,
        },
        { header: "مقصد بار", key: "load_destination", width: 20 },
        { header: "وضعیت تخلیه", key: "discharge_status", width: 10 },
        {
          header: "شماره بارنامه خروجی",
          key: "outbound_bill_of_lading_number",
          width: 23,
        },
        { header: "وزن پر مقصد 3", key: "destinationFullWeight", width: 15 },
        { header: "وزن خالی مقصد 3", key: "destinationEmptyWeight", width: 15 },
        { header: "وزن خالص مقصد 3", key: "destinationNetWeight", width: 15 },
        {
          header: "روز خروج از مقصد 3",
          key: "destinationExitDateDay",
          width: 10,
        },
        {
          header: "ماه خروج از مقصد 3",
          key: "destinationExitDateMonth",
          width: 10,
        },
        {
          header: "سال خروج از مقصد 3",
          key: "destinationExitDateYear",
          width: 13,
        },
        {
          header: "تاریخ خروج از مقصد 3",
          key: "destinationExitDate",
          width: 15,
        },
        {
          header: "ساعت خروج از مقصد 3",
          key: "destinationExitTime",
          width: 15,
        },
        { header: "خواب بین مسیر", key: "onTheWaySleep", width: 15 },
        { header: "خواب مقصد", key: "destinationSleep", width: 15 },
        {
          header: "خواب از زمان نوبت دهی حراست تا خروج از باسکول (وضعیت E)",
          key: "EStatusSleep",
          width: 15,
        },
        {
          header: "خواب مبدأ + خواب مقصد (وضعیت E)",
          key: "EOriginPlusDestinationSleep",
          width: 15,
        },
        {
          header: "تفاضل وزن پالایشگاه و مقصد",
          key: "refineryWeightAndDestinationWeightDifference",
          width: 15,
        },
        { header: "توضیحات", key: "description", width: 70 },
        { header: "محصول خروجی", key: "pierProduct", width: 15 },
        { header: "مخزن", key: "tanker", width: 15 },
        {
          header: "تاریخ خروج از مبدأ",
          key: "bulkoutputWeighbridgeLeavingDate",
          width: 15,
        },
        { header: "وزن خالص اسکله", key: "pierNetWeight", width: 15 },
        {
          header: "تجمیع محصول + پالایشگاه",
          key: "productPlusRefinery",
          width: 30,
        },
        { header: "ناوگان", key: "", width: 15 },
      ];
      worksheet.autoFilter = "A1:CL1";
      worksheet.getRow(1).height = 80;
      worksheet.getRow(1).eachCell((cell, colNum) => {
        cell.style = {
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
          fill: {
            type: "pattern",
            pattern: "solid",
          },
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
          font: {
            bold: true,
            size: 13,
            name: "B Nazanin",
          },
        };
        if (colNum > 0 && colNum < 28) {
          cell.fill.fgColor = { argb: "FFB8D6A3" };
        } else if (colNum === 28) {
          cell.fill.fgColor = { argb: "FFFF4000" };
        } else if (colNum > 28 && colNum < 36) {
          cell.fill.fgColor = { argb: "FFB8D6A3" };
        } else if (colNum > 35 && colNum < 38) {
          cell.fill.fgColor = { argb: "FFF6BE98" };
        } else if (colNum > 37 && colNum < 43) {
          cell.fill.fgColor = { argb: "FFFFE080" };
        } else if (colNum === 43) {
          cell.fill.fgColor = { argb: "FFFF4000" };
        } else if (colNum > 43 && colNum < 46) {
          cell.fill.fgColor = { argb: "FFFFE080" };
        } else if (colNum === 46) {
          cell.fill.fgColor = { argb: "FF00B050" };
        } else if (colNum > 46 && colNum < 49) {
          cell.fill.fgColor = { argb: "FFFFE080" };
        } else if (colNum > 48 && colNum < 61) {
          cell.fill.fgColor = { argb: "FFDFDFDF" };
        } else if (colNum > 60 && colNum < 63) {
          cell.fill.fgColor = { argb: "FFFF4000" };
        } else if (colNum > 62 && colNum < 65) {
          cell.fill.fgColor = { argb: "FFDFDFDF" };
        } else if (colNum === 65) {
          cell.fill.fgColor = { argb: "FFFFFFFF" };
        } else if (colNum === 66) {
          cell.fill.fgColor = { argb: "FF8BD2FD" };
        } else if (colNum > 66 && colNum < 72) {
          cell.fill.fgColor = { argb: "FFDFDFDF" };
        } else if (colNum > 71 && colNum < 84) {
          cell.fill.fgColor = { argb: "FFFFF3CC" };
        } else if (colNum === 84) {
          cell.fill.fgColor = { argb: "FFFFF3CC" };
          cell.font.color = { argb: "FFFF0000" };
        } else if (colNum > 84 && colNum < 90) {
          cell.fill.fgColor = { argb: "FFDFDFDF" };
        } else if (colNum > 89 && colNum < 93) {
          cell.fill.fgColor = { argb: "FFFFFFFF" };
        }
      });
      worksheet.addRows(data);
      worksheet.eachRow((row, i) => {
        row.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        row.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        row.font = {
          size: 12,
          name: "B Nazanin",
          bold: true,
        };
        worksheet.getRow(i + 1).height = 22;
      });

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/octet-stream",
        });
        saveAs(blob, "گزارش اطلاعات ورودی.xlsx");
        console.timeEnd("export");
        this.loading = "";
      });
    },
    newData() {
      this.newEdit = true;
    },
    editData() {
      console.log("edit", this.vmData);
      this.editId = this.vmData[0].row;
      this.newEdit = true;
    },
    closeNewEdit() {
      this.newEdit = false;
      this.editId = null;
    },
    openDeleteDialog() {
      this.deleteDialog = true;
    },
    closeDialog() {
      this.deleteDialog = false;
      this.vmData = [];
    },
    deleteData() {
      this.loading = "delete";
      const { $axios } = useNuxtApp();
      console.log("this.vmData", this.vmData);
      $axios
        // .delete("/api/weighbridgeInput/" + this.vmData[0].id)
        .delete("/api/weighbridgeInput/" + this.vmData[0])
        .then(() => {
          const INDEX = this.mainData.findIndex(
            (item) => item.id === this.vmData[0].id,
          );
          this.mainData.splice(INDEX, 1);
          const store = useNotificationStore();
          store.successNotification("رکورد با موفقیت حذف شد.");
        })
        .finally(() => {
          this.vmData = [];
          this.loading = "";
          this.deleteDialog = false;
        });
    },
    tablePageChange(options) {
      if (this.currentItemsPerPage !== options.itemsPerPage) {
        this.tableOptions.currentPage = 1;
        this.tableOptions.page = 1;
        this.currentItemsPerPage = options.itemsPerPage;
      }
      if (options.page > this.tableOptions.currentPage) {
        this.getReport(this.tableOptions.page);
        this.tableOptions.currentPage = options.page;
      } else {
        this.getReport(this.tableOptions.page);
        this.tableOptions.currentPage = options.page;
      }
    },
    recoveryData() {
      this.openRecoveryDialog = true;
    },
    openRecoveryDialogHandler() {
      this.openRecoveryDialog = false;
      // if (data.length > 0) {
      //   this.mainData.push(...data)
      // }
    },
    clearFilter() {
      this.showPlaque = false;
      this.$refs.form.reset();
      this.startDate = "";
      this.endDate = "";
      this.$nextTick(() => {
        this.plaque = "";
        this.showPlaque = true;
      });
      this.mainData = [];
    },
  },
};
</script>

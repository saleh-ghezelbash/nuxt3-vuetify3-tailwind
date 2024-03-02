<template>
  <v-dialog
    v-model="openDialog"
    eslint-disable-next-line
    no-tabs
    persistent
    width="900"
    scrollable
  >
    <v-card>
      <v-card-title>
        <span>{{ "بازیابی اطلاعات" }}</span>
      </v-card-title>
      <v-divider />
      <v-card-text style="max-height: 900px">
        <v-data-table
          v-model="vmData"
          :headers="tableHeaders"
          :items="mainData"
          :loading="loading === 'get'"
          show-select
          select-strategy="multiple"
          item-key="id"
          return-object
          :footer-props="{
            itemsPerPageOptions: [5, 10, 20, 50],
          }"
        >
          <template #header.data-table-select />
          <template #item.deleted_at="{ item }">
            {{ toJalaali(item.deleted_at) }}
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="vmData.length === 0"
          plain
          :loading="loading === 'recovery'"
          @click="recoverData"
        >
          بازیابی
        </v-btn>
        <v-btn plain :disabled="loading === 'recovery'" @click="closeDialog">
          بستن
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment-jalaali";
export default {
  name: "RecoveryComponent",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: "",
    },
    headers: {
      type: Array,
      default: () => [
        { text: "ردیف", value: "row" },
        { text: "محصول", value: "product" },
      ],
    },
  },
  emits: ["close"],
  data() {
    return {
      openDialog: true,
      tableHeaders: [],
      vmData: [],
      mainData: [],
      tableOptions: {
        page: 1,
        itemsPerPage: 5,
        currentPage: 1,
      },
      serverItemsLength: 0,
      loading: "get",
    };
  },
  // computed: {
  //   show: {
  //     get () {
  //       return this.value
  //     },
  //     set (value) {
  //       this.$emit('input', value)
  //     }
  //   }
  // },
  created() {
    this.tableHeaders = [
      ...this.headers,
      { text: "تاریخ حذف", value: "deleted_at" },
    ];
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get(this.url)
        .then((res) => {
          this.mainData = res.data;
        })
        .finally(() => {
          this.loading = "";
        });
    },
    recoverData() {
      this.loading = "recovery";
      const RECOVERY_DATA = this.vmData.map((v) => v?.id);
      this.$axios.put(this.url, { recoveryData: RECOVERY_DATA }).then((res) => {
        this.loading = "";
        this.closeDialog(res.data);
        this.$store.commit(
          "notification/successNotification",
          "رکورد با موفقیت بازیابی شد.",
        );
      });
    },
    closeDialog(data) {
      this.openDialog = false;
      this.$emit("close", data);
    },
    toJalaali(date) {
      return moment(date).format("jYYYY/jMM/jDD - HH:mm");
    },
  },
};
</script>

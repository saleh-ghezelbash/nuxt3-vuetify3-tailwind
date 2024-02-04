<template>
  <div>
    <v-text-field
      v-model="date"
      :label="label"
      :readonly="readonly"
      :rules="[isDate(date), requiredValue(date, label)]"
      :tabindex="tabIndex"
      :clearable="clearable"
      @keydown="changeDate"
    >
      <template #append>
        <v-menu
          v-model="pickerMenu"
          :close-on-content-click="false"
          :nudge-right="150"
          transition="scroll-y-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ props }">
            <v-icon v-bind="props"> mdi-calendar-outline </v-icon>
          </template>
          <v-date-picker
            v-model="pickerDate"
            first-day-of-week="6"
            @update:model-value="updatePickerDate"
          />
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import moment from "moment-jalaali";
import { rules } from "../mixins/rules";
export default {
  mixins: [rules],
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    outlined: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input"],
  data() {
    return {
      date: "",
      pickerDate: new Date(),
      pickerMenu: false,
    };
  },
  watch: {
    date() {
      if (this.date && this.date.length === 10) {
        this.$emit("input", this.date);
      } else if (!this.date) {
        this.$emit("input", this.date);
      }
      console.log("this.date", this.date);
    },
    pickerMenu() {
      if (this.pickerMenu && this.date && this.date.length === 10) {
        this.pickerDate = moment(this.date, "jYYYY/jMM/jDD").format(
          "YYYY-MM-DD",
        );
      }
    },
  },
  created() {
    this.date = this.value;
    moment.loadPersian({ usePersianDigits: false });
  },
  methods: {
    changeDate(e) {
      if (e.key === "ArrowDown") {
        if (this.date && this.date.length === 10) {
          this.date = moment(this.date, "jYYYY/jMM/jDD")
            .subtract(1, "days")
            .format("jYYYY/jMM/jDD");
        } else {
          this.date = moment().format("jYYYY/jMM/jDD");
        }
      } else if (e.key === "ArrowUp") {
        if (this.date && this.date.length === 10) {
          this.date = moment(this.date, "jYYYY/jMM/jDD")
            .add(1, "days")
            .format("jYYYY/jMM/jDD");
        } else {
          this.date = moment().format("jYYYY/jMM/jDD");
        }
      }
    },
    requiredValue(data, label) {
      if (this.required) {
        return this.hasValue(data, label);
      } else {
        return true;
      }
    },
    setPersianDate(e) {
      this.date = moment(e).format("jYYYY/jMM/jDD");
      this.pickerMenu = false;
    },
    updatePickerDate(e) {
      this.date = moment(e).format("jYYYY/jMM/jDD");
      this.pickerMenu = false;
    },
  },
};
</script>

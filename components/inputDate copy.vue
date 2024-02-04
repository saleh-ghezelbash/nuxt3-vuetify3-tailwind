<template>
  <div>
    <v-text-field
      ref="datePlace"
      :value="value"
      :label="label"
      :outlined="outlined"
      :readonly="readonly"
      :dense="dense"
      :rules="[isDate(date), requiredValue(date, label), ...rules]"
      :tabindex="tabIndex"
      :clearable="clearable"
      @keydown="changeDate"
      @keyup.enter="emitKeyup"
      @click:clear="date = ''"
      @change="change"
    >
      <template #append>
        <v-menu
          v-model="pickerMenu"
          :close-on-content-click="false"
          :nudge-right="150"
          transition="scroll-y-transition"
          offset-y
          min-width="auto"
          class="tw-h-96"
        >
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" :id="id" :disabled="disabled" v-on="on">
              mdi-calendar-outline
            </v-icon>
          </template>
          <date-picker
            :value="date"
            popover="right"
            :custom-input="`#${id}`"
            :auto-submit="true"
            locale="fa"
            :min="min"
            :max="max"
            @input="changeDatePicker"
          />
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import moment from "moment-jalaali";
// import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import { rules } from "../mixins/rules";
import Vue3PersianDatetimePicker from "~/components/picker/Vue3PersianDatetimePicker";
export default {
  components: { datePicker: Vue3PersianDatetimePicker },
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
    dense: {
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
    disabled: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    min: {
      type: String,
      default: null,
    },
    max: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      id: "",
      date: "",
      // pickerDate: '',
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
    },
    pickerMenu() {
      // if (this.pickerMenu && this.date && this.date.length === 10) {
      //   this.pickerDate = moment(this.date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
      // }
    },
    value() {
      this.date = this.value;
    },
  },
  created() {
    this.date = this.value;
    this.id = "t" + Date.now();
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
    // setPersianDate () {
    //   this.date = moment(this.pickerDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')
    //   this.pickerMenu = false
    // },
    emitKeyup() {
      this.$emit("keyup");
    },
    changeDatePicker(e) {
      this.$refs.datePlace.focus();
      this.date = e;
    },
    change(val) {
      this.date = val;
    },
  },
};
</script>

<style>
:is(.vpd-prev, .vpd-next) svg {
  margin: auto;
}
</style>

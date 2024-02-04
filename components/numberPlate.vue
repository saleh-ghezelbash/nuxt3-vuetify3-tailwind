<template>
  <v-row
    dense
    class="tw-border tw-border-gray-400 tw-rounded tw-flex-row-reverse"
  >
    <v-col cols="2" class="!tw-p-0">
      <div
        class="d-flex tw-flex-col tw-w-full tw-h-full tw-bg-blue-900 tw-text-white tw-text-left tw-text-xs tw-px-1 tw-pt-1 tw-rounded-l"
      >
        <img src="/Iran-flag.png" />
        <span class="tw-mt-1.5 -tw-mb-0.5" style="font-size: 0.9em">
          .I.R
        </span>
        <span style="font-size: 0.9em">IRAN</span>
      </div>
    </v-col>
    <v-col cols="2" class="my-auto">
      <v-text-field
        ref="part1"
        v-model="numberPlate[0]"
        hide-details
        style="text-align-last: center"
        :rules="[required ? hasValue(numberPlate[3], '') : true]"
        :tabindex="tabindex"
        @keyup="plaqueNextField(numberPlate[0], 2, 'part3')"
        @keypress="checkValue($event, numberPlate[0], 2)"
        @change="() => $emit('change')"
        @blur="emmitInput"
      />
    </v-col>
    <v-col cols="2" class="my-auto">
      <v-text-field
        v-model="numberPlate[1]"
        hide-details
        style="text-align-last: center"
        :rules="[required ? hasValue(numberPlate[3], '') : true]"
        :tabindex="tabindex"
        @keypress="checkValue($event, numberPlate[1], 1)"
        @change="() => $emit('change')"
        @blur="emmitInput"
      />
    </v-col>
    <v-col cols="3" class="my-auto">
      <v-text-field
        ref="part3"
        v-model="numberPlate[2]"
        hide-details
        style="text-align-last: center"
        :rules="[required ? hasValue(numberPlate[3], '') : true]"
        :tabindex="tabindex"
        @keyup="plaqueNextField(numberPlate[2], 3, 'part4')"
        @keypress="checkValue($event, numberPlate[2], 3)"
        @change="() => $emit('change')"
        @blur="emmitInput"
      />
    </v-col>
    <v-col cols="3" class="tw-border-l tw-border-gray-400">
      <div class="tw-text-xs text-center tw-mb-1.5">
        ایـران{{ required ? " *" : "" }}
      </div>
      <v-text-field
        ref="part4"
        v-model="numberPlate[3]"
        hide-details
        class="mt-n3"
        style="text-align-last: center"
        :rules="[required ? hasValue(numberPlate[3], '') : true]"
        :tabindex="tabindex"
        @keypress="checkValue($event, numberPlate[3], 2)"
        @change="() => $emit('change')"
        @blur="emmitInput"
      />
    </v-col>
  </v-row>
</template>

<script>
import { rules } from "@/mixins/rules";
export default {
  name: "NumberPlate",
  mixins: [rules],
  props: {
    value: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      numberPlate: ["", "ع", "", ""],
    };
  },
  created() {
    if (this.value) {
      this.numberPlate[0] = this.value.slice(0, 2);
      this.numberPlate[2] = this.value.slice(3, 6);
      this.numberPlate[3] = this.value.slice(6, 8);
    }
  },
  methods: {
    checkValue(e, value, max) {
      if (value.toString().length === max) {
        e.preventDefault();
      }
    },
    plaqueNextField(value, count, next) {
      if (value.toString().length === count) {
        this.$refs[next].focus();
      }
    },
    emmitInput() {
      const NUMBER_PLATE = this.numberPlate.join("");
      if (NUMBER_PLATE.length > 1) {
        this.$emit("input", NUMBER_PLATE);
      } else {
        this.$emit("input", "");
      }
    },
  },
};
</script>

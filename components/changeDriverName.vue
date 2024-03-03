<template>
  <v-dialog v-model="showDialog" persistent width="500">
    <v-card>
      <v-card-title>
        <span>{{ "تغییر نام راننده" }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="currentName"
                  label="نام فعلی"
                  outlined
                  readonly
                  :rules="[hasValue(currentName, 'نام فعلی')]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newName"
                  label="نام جدید"
                  outlined
                  :rules="[hasValue(newName, 'نام جدید')]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn plain :loading="loading" @click="save"> ذخیره </v-btn>
        <v-btn plain :disabled="loading" @click="closeDialog"> بستن </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { rules } from "../../mixins/rules";
export default {
  mixins: [rules],
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
  data() {
    return {
      showDialog: true,
      currentName: "",
      newName: "",
      loading: false,
    };
  },
  created() {
    this.showDialog = this.value;
    this.currentName = this.name;
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const DATA = {
          currentName: this.currentName,
          newName: this.newName,
        };
        const { $axios } = useNuxtApp();
        $axios
          .put("/api/changeDriverName", DATA)
          .then(() => {
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    closeDialog() {
      this.showDialog = false;
      this.$emit("close", this.newName);
    },
  },
};
</script>

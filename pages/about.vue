<template>
  <div>
    <div>About page</div>
    <inputDate />
    <v-text-field v-model="text"></v-text-field>
  </div>
</template>

<script>
export default {
  // layout: "test",
  data() {
    return {
      text: "",
    };
  },
  created() {
    // definePageMeta({
    //   layout: "test",
    // });
  },
};
</script>
<!-- <script setup lang="ts">
definePageMeta({
  layout: "test",
});
</script> -->

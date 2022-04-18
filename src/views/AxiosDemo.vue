<template>
  <div>{{ info }}</div>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  name: "AxiosDemo",
  setup() {},
  data() {
    return {
      info: null,
    };
  },
  mounted() {
    this.callApi();
  },
  methods: {
    callApi: function () {
      axios
        .get("https://api.apiopen.top/getJoke?page=1&count=2&type=video")
        .then((response) => (this.info = response.data));
    },
  },
});
</script>
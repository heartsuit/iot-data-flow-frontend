<template>
  <div id="chart" :style="{ width: '1000px', height: '550px' }"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "EchartsDemo",
  setup() {},
  mounted() {
    this.getEchart();
  },
  methods: {
    getEchart() {
      let myChart = echarts.init(document.getElementById("chart"));
      myChart.setOption({
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
      window.onresize = function () {
        console.log("Resized..");
        myChart.resize();
      };
    },
  },
};
</script>

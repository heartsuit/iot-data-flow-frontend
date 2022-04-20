<!--
 描述: 设备数据趋势
 作者: Heartsuit
 日期: 2021-09-15
-->

<template>
  <!-- <div class="ch-title">近1小时设备电压、电流、温度变化趋势</div> -->
  <div class="ch-body">
    <div class="chart" id="trend"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  name: "PowerTrend",
  props: ["sn"],
  data() {
    return {
      option: null,
      xAxisData: [],
      categories: ["电压", "电流", "温度"],
      series: [],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      axios
        .get(
          `/api/power/getDeviceDataTrend?startTime=2021-11-11 14:05:11.138&endTime=2021-11-11 14:13:11.138`,
          {
            params: { sn: this.sn },
          }
        )
        .then((res) => {
          if (res.data) {
            this.xData = res.data.data.axisX;
            let seriesData = res.data.data.series;
            for (const category of this.categories) {
              this.series.push({
                name: category,
                type: "line",
                data: seriesData[category].map((x) => x.toFixed(2)),
                areaStyle: {},
                smooth: true,
              });
            }
            this.getEchart();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getEchart() {
      let myChart = echarts.init(document.getElementById("trend"));
      this.option = {
        color: ["#00c86c", "#ff9235", "#1b40e3"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          // tooltip透明背景色
          backgroundColor: "rgba(0,0,0,0.8)",
          borderColor: "gray",
          // tooltip里的文字左对齐
          textStyle: {
            align: "left",
            color: "#FFFFFF",
          },
        },
        legend: {
          data: this.categories,
          // top:"bottom",
          left: "center",
          icon: "diamond",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData,
          axisLabel: {
            formatter: "{value}",
            color: "#000000",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#000000",
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#999",
            },
          },
        },
        series: this.series,
      };
      myChart.setOption(this.option, true);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
  beforeUnmount() {
    console.log("Unmout!");
  },
};
</script>

<style lang="scss" scoped>
// .chart {
//   width: 900px;
//   height: 350px;
// }

.chart {
  width: 100%;
  height: 350px;
}
</style>

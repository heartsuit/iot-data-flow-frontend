<template>
  <div class="index-power">
    <Loading v-if="loading" marginTop="20%"></Loading>

    <div v-if="!loading">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
          >当前城市：<el-cascader
            v-model="groupDefault"
            :options="groups"
            @change="cityChanged"
            placeholder="请选择城市"
            :props="groupProps"
            clearable
            filterable
          ></el-cascader>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          数据总量：{{ dataAvgInCity.total }} 电压平均值：{{
            dataAvgInCity.voltage.toFixed(2)
          }}
          V 电流平均值：{{ dataAvgInCity.currente.toFixed(2) }} mA
          温度平均值：{{ dataAvgInCity.temperature.toFixed(2) }} ℃
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
          >数据总量：{{ total }}</el-col
        >
      </el-row>
    </div>

    <el-row :gutter="15">
      <el-col
        v-for="(power, index) in powers"
        v-bind:key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <!-- <transition name="mode-fade" mode="out-in" v-show="power.hasNew"> -->
        <el-card
          shadow="hover"
          class="box-card"
          :class="{ shake: power.hasNew }"
        >
          <template #header>
            <div class="card-header">
              <span>{{ tableNames[index] }}</span>
              <el-button
                class="button"
                type="text"
                @click="showDeviceDataDialog(index)"
                >详情</el-button
              >
            </div>
          </template>
          <div class="text item">电压：{{ power.voltage }} V</div>
          <div class="text item">电流：{{ power.currente }} mA</div>
          <div class="text item">温度：{{ power.temperature }} ℃</div>
          <div class="text item">
            <el-icon color="#409EFC" :size="20" style="vertical-align: top">
              <timer /> </el-icon
            >：{{ power.ts }}
          </div>
        </el-card>
        <!-- </transition> -->
      </el-col>
    </el-row>

    <el-dialog
      :title="historyData"
      v-model="dialogTableVisible"
      width="60%"
      destroy-on-close
    >
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane label="历史数据">
          <div style="text-align: right">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="datetimerange"
              :shortcuts="dateRangeShortcuts"
              @change="handleChangeDateRange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="exportXls"
              style="margin-left: 10px"
              size="small"
              :loading="exportLoading"
              >导出</el-button
            >
          </div>

          <el-table v-loading="dataLoading" :data="deviceDataPage.records">
            <el-table-column
              property="ts"
              label="时间"
              width="180"
            ></el-table-column>
            <el-table-column
              property="voltage"
              label="电压/V"
            ></el-table-column>
            <el-table-column
              property="currente"
              label="电流/mA"
            ></el-table-column>
            <el-table-column
              property="temperature"
              label="温度/℃"
            ></el-table-column>
            <el-table-column property="sn" label="设备编号"></el-table-column>
            <el-table-column property="city" label="城市"></el-table-column>
            <el-table-column property="groupid" label="分组"></el-table-column>
          </el-table>

          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            :total="deviceDataPage.total"
            v-model:current-page="currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="数据统计" lazy>
          <power-trend v-if="showChart" :sn="sn"></power-trend
        ></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Loading from "../components/Loading.vue";
import axios from "axios";
import { formatTime } from "../utils/util";
import { Timer } from "@element-plus/icons";
import PowerTrend from "../components/PowerTrend.vue";

export default defineComponent({
  name: "PowerView",
  setup() {},
  data() {
    return {
      loading: true,
      dataLoading: true,

      total: 0,
      dataAvgInCity: {
        total: 0,
        voltage: 0,
        currente: 0,
        temperature: 0,
      },

      groupProps: { expandTrigger: "hover" },
      groupDefault: [1, "太原"],
      groups: [
        {
          value: 1,
          label: "山西",
          children: [
            { value: "太原", label: "太原" },
            { value: "大同", label: "大同" },
            { value: "阳泉", label: "阳泉" },
            { value: "长治", label: "长治" },
            { value: "晋城", label: "晋城" },
            { value: "朔州", label: "朔州" },
            { value: "晋中", label: "晋中" },
            { value: "运城", label: "运城" },
            { value: "忻州", label: "忻州" },
            { value: "临汾", label: "临汾" },
            { value: "吕梁", label: "吕梁" },
          ],
        },
        {
          value: 2,
          label: "陕西",
          children: [
            { value: "西安", label: "西安" },
            { value: "铜川", label: "铜川" },
            { value: "宝鸡", label: "宝鸡" },
            { value: "咸阳", label: "咸阳" },
            { value: "渭南", label: "渭南" },
            { value: "延安", label: "延安" },
            { value: "汉中", label: "汉中" },
            { value: "榆林", label: "榆林" },
            { value: "安康", label: "安康" },
            { value: "商洛", label: "商洛" },
          ],
        },
      ],
      thisCity: "太原",

      tableNames: [],
      powers: [],

      selectedDevice: 0,
      dialogTableVisible: false,

      deviceDataPage: { total: 0, records: [] },
      pageSize: 10,
      currentPage: 1,

      dateRangeShortcuts: [
        {
          text: "最近1天",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            return [start, end];
          },
        },
        {
          text: "最近一周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "最近一个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: "最近三个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
      ],
      dateRange: [
        new Date().getTime() - 3600 * 1000 * 24 * 365,
        new Date().getTime(),
      ],

      websocket: "",

      exportLoading: false,

      showChart: false,
    };
  },
  computed: {
    historyData() {
      return `设备：${this.tableNames[this.selectedDevice]}`;
    },
    sn() {
      let selectedTableName = this.tableNames[this.selectedDevice];
      let sn = selectedTableName.substr("device".length);
      return sn;
    },
  },
  components: {
    Loading,
    Timer,
    PowerTrend,
  },
  created() {
    this.getTotal();
    this.getTotalInCity(this.thisCity);
    this.getLastValue(this.thisCity);
  },
  mounted() {},
  methods: {
    formatTime,

    cityChanged: function (value) {
      console.log(10, value);
      if (!value) {
        return;
      }
      console.log(11, Object.entries(value));
      console.log(12, Object.values(value));
      // this.thisCity = Object.values(value)[1];
      this.thisCity = value[1];
      console.log(13, this.thisCity);
      this.getLastValue(this.thisCity);
      this.getTotalInCity(this.thisCity);
    },

    getTotal: function () {
      let that = this;
      axios.get(`/api/power/total`).then(
        function (res) {
          if (res.status == 200) {
            that.total = res.data.data;
          } else {
            console.error(res);
          }
        },
        function (res) {
          console.error(res);
        }
      );
    },

    getTotalInCity: function (city) {
      let that = this;
      axios.get(`/api/power/totalInCity/${city}`).then(
        function (res) {
          if (res.status == 200) {
            console.log("getTotalInCity", res.data.data);
            that.dataAvgInCity = res.data.data;
          } else {
            console.error(res);
          }
        },
        function (res) {
          console.error(res);
        }
      );
    },

    getLastValue: function (city) {
      let that = this;
      axios.get(`/api/power/lastValue/${city}`).then(
        function (res) {
          if (res.status == 200) {
            that.loading = false;
            console.log("getLastValue", res.data.data);
            that.tableNames = res.data.data.tableNames;
            that.powers = res.data.data.powers;
          } else {
            console.error(res);
          }
        },
        function (res) {
          console.error(res);
        }
      );
    },

    showDeviceDataDialog: function (index) {
      this.selectedDevice = index;
      this.dialogTableVisible = true;

      // 每次弹窗时，重置日期时间选择器为查询近一年的数据
      this.dateRange = [
        new Date().getTime() - 3600 * 1000 * 24 * 365,
        new Date().getTime(),
      ];

      this.getDeviceData();
    },

    getDeviceData: function () {
      this.dataLoading = true;
      // 时间为空时，进行错误提示
      if (!this.dateRange) {
        this.$message({
          type: "error",
          message: "请选择时间范围！",
          showClose: true,
        });
        return;
      }

      let startTime = this.dateRange[0];
      let endTime = this.dateRange[1];

      let that = this;
      axios
        .get(
          `/api/power/getDeviceData?page=${this.currentPage}&size=${this.pageSize}&sn=${this.sn}&startTime=${startTime}&endTime=${endTime}`
        )
        .then(
          function (res) {
            that.dataLoading = false;
            if (res.status == 200) {
              that.deviceDataPage = res.data.data;
            } else {
              console.error(res);
            }
          },
          function (res) {
            that.dataLoading = false;
            console.error(res);
          }
        );
    },
    handleCurrentChange: function (val) {
      this.currentPage = val;
      this.getDeviceData();
    },
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getDeviceData();
    },
    handleChangeDateRange: function (val) {
      if (val) {
        this.dateRange[0] = val[0].getTime();
        this.dateRange[1] = val[1].getTime();
        this.getDeviceData();
      }
    },
    exportXls: function () {
      if (this.deviceDataPage.records.length == 0) {
        this.$message({
          type: "warning",
          message: "暂无数据",
          center: false,
          showClose: true,
        });
        return;
      }
      if (!this.dateRange) {
        this.$message({
          type: "error",
          message: "请选择时间范围！",
          showClose: true,
        });
        return;
      }
      this.exportLoading = true;

      let startTime = this.dateRange[0];
      let endTime = this.dateRange[1];

      let that = this;
      axios
        .get(
          `/api/power/exportXls?sn=${this.sn}&startTime=${startTime}&endTime=${endTime}`,
          { responseType: "blob" }
        )
        .then(
          function (res) {
            if (res.status == 200) {
              that.exportLoading = false;
              let blob = new Blob([res.data]);
              let downloadElement = document.createElement("a");
              let href = window.URL.createObjectURL(blob);
              downloadElement.href = href;
              downloadElement.download = decodeURI(
                res.headers["content-disposition"].substr(
                  "attachment; filename=".length
                )
              );
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement);
              window.URL.revokeObjectURL(href);
            } else {
              that.exportLoading = false;
              console.error(res);
            }
          },
          function (res) {
            that.exportLoading = false;
            console.error(res);
          }
        );
    },
    handleClick(tab, event) {
      console.log(tab);
      console.log(tab.props.label);
      console.log(event);
      // console.log(1, Object.entries(tab));
      // console.log(2, Object.values(tab));
      if (tab.props.label == "数据统计") {
        this.showChart = true;
      }
    },

    // handleCloseDialog(done){
    //   console.log("handleCloseDialog", done);
    //   this.showChart=false;
    //   done();
    // }
  },
});
</script>

<style scoped>
.card-header {
  height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 5px;
  text-align: left;
}

.box-card {
  margin-top: 5px;
}

.mode-fade-enter-active,
.mode-fade-leave-active {
  background-color: aquamarine;
  transition: opacity 1.5s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
    background-color: aquamarine;
    transition: opacity 1s ease;
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>

<template>
  <div>
    <el-table
      :data="deviceList"
      :loading="listLoading"
      :fit="true"
      style="width: 100%"
      @sort-change="tableSortChange"
    >
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="序号" align="center" sortable="true" width ="45"/>
      <el-table-column prop="deviceIDKey" label="设备ID" align="center" sortable="true" width = "120" />
      <el-table-column prop="utcTime" label="UTC时间戳" align="center" sortable="true" />
      <el-table-column prop="batteryLevel" label="电池电量（%）" align="center" width = "80"/>
      <el-table-column prop="batteryVoltage" label="电池电压" align="center" sortable="true" />
      <el-table-column prop="collectTimeKey" label="采集时间" align="center" sortable="true" />
      <el-table-column prop="readInterval" label="采集间隔" align="center" width ="80" />
      <el-table-column prop="remainReport" label="余报数" align="center" width = "55"/>
      <el-table-column prop="randnum" label="随机数" align="center" />
      <el-table-column prop="controlCode" label="控制码" align="center" />
      <el-table-column prop="csq" label="信号强度" align="center" sortable="true" />
      <el-table-column prop="gpsLon" label="GPSLon" align="center" sortable="true" />
      <el-table-column prop="gpsLat" label="GPSLat" align="center" sortable="true" />
      <el-table-column label="详情" align="center" width = "200">
        <template #default="scope">
          <el-row type="flex" justify="center">
            <!-- 点击这个按钮会触发 "goToMessage" 方法 -->
            <el-button size="small" style="margin-bottom: 5px;" @click = "goToMessage(scope.row)">管网检测</el-button>
            <!-- 点击这个按钮会触发 "goToLinecharts" 方法 -->
            <el-button size="small" @click="goToLinecharts(scope.row)">数据折线图</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <router-view></router-view>

    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
    <div>
      <el-button @click="toggleSelection(tableData)">Select All Rows</el-button>
      <el-button @click="toggleSelection()">Clear selection</el-button>
    </div>
    <el-pagination background layout="prev, pager, next" :total="100" />
  </div>
    <div>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script  setup>
import { ref, defineProps, defineEmits,reactive,onMounted} from 'vue';
import util from '../../common/js/util';
import axios from 'axios';
import md5 from 'js-md5';
import { UserConstant } from '../../common/constant';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();

const axiosInstance = axios.create({
  baseURL: window.g.url,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  withCredentials: false,
});

const deviceList = ref([]);
const listLoading = ref(true);
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const orderField = ref('');
const orderType = ref('desc');

const fetchDevices = () => {
  listLoading.value = true;
  // TODO: Update the URL according to your backend API
  axiosInstance.post(window.g.url +'/device/list', {
    currentPage: 1,
    orderField: 'collecttimekey',
    orderType: 'desc',
    username: 'admin'
}, {
    headers: {
      Authorization: localStorage.getItem('token'),
      'Content-Type': 'application/json'  // 确保发送的内容类型是JSON
    }
  }).then(response => {
    if (response.data && response.data.deviceList) {
      deviceList.value = response.data.deviceList.list;
      total.value = response.data.deviceList.totalCount;
      listLoading.value = false;
    }
  }).catch(error => {
    console.error("API request error:", error);
    listLoading.value = false;
  });
};


onMounted(fetchDevices);

const handleCurrentChange = (val) => {
  page.value = val;
  fetchDevices();
};

const tableSortChange = ({ column }) => {
  orderField.value = column.property;
  orderType.value = column.order === 'descending' ? 'desc' : 'asc';
  fetchDevices();
};

const goToMessage = (rowData) => {
  // 跳转到 "/home/message" 路径
  router.push({ path: '/home/message', query: { deviceIDKey: rowData.deviceIDKey } });
};

const goToLinecharts = (rowData) => {
  router.push({ path: '/home/linecharts', query: { deviceIDKey: rowData.deviceIDKey } });
};



</script>



<style>
.customWidth {
  width: 1200px;
}
.btn-gradient {
  width: 85%;
  text-align: center;
  margin: 8px;
}
.border {
  float: left;
  width: 130px;
  height: 104px;
  margin-left: 10px;
  text-align: center;
  border-style: solid;
  color: #e4e7ed;
  border-radius: 8px;
}

</style>




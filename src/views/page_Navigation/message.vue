<template>
  <div>
  <el-table :data="SensorMessageList" stripe style="width: 100%" @sort-change='tableSortChange'>
    <el-table-column prop="deviceIDKey" label="设备ID" width="100" align="center" sortable='custom' />
    <el-table-column prop="ts" label="采集时间" width="150" align="center" sortable='custom' />
    <el-table-column prop="soilPh" label="土壤PH"  width="150" align="center" sortable='custom'/>
    <el-table-column prop="waterContent1" label="含水率1"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="temperature1" label="温度1"  width="150" align="center" sortable='custom'/>
    <el-table-column prop="soilCondictivity1" label="土壤电导率1"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="salinity1" label="Salinity1"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="tds1" label="Tds1"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="waterContent2" label="含水率2"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="temperature2" label="温度2"  width="150" align="center" sortable='custom'/>
    <el-table-column prop="soilCondictivity2" label="土壤电导率2"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="salinity2" label="Salinity2"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="tds2" label="Tds2"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="waterContent3" label="含水率3"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="temperature3" label="温度3"  width="150" align="center" sortable='custom'/>
    <el-table-column prop="soilCondictivity3" label="土壤电导率3"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="salinity3" label="Salinity3"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="tds3" label="Tds3"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="methanePotency" label="甲烷浓度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="systemTemperature" label="系统温度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="systemHumidity" label="系统湿度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="id" label="自增量"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="ts_partation" label="采集时间(int8)"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilCh4" label="土壤甲烷"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilCh4humi" label="土壤甲烷湿度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilCh4temp" label="土壤甲烷温度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3temp" label="土壤温振温度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3xspeed" label="土壤温振X速度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3yspeed" label="土壤温振Y速度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3zspeed" label="土壤温振Z速度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3xdistance" label="土壤温振X位移"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3ydistance" label="土壤温振Y位移"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3zdistance" label="士壤温振Z位移"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3xacc" label="土壤温振X加速度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3yacc" label="土壤温振Y加速度"  width="100" align="center" sortable='custom'/>
    <el-table-column prop="soilWz3zacc" label="土壤温振Z加速度"  width="100" align="center" sortable='custom'/>
  </el-table>
    <el-row class="toolbar">
      <el-col :span="6">
        <el-button type="primary" @click="returnback">返回</el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  withCredentials: false,
});

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore(); // 为了调用 Vuex 的方法
    const currentPage = ref(1);
    const total = ref(20);
    const pageSize = ref(10);
    // const filters = reactive({
    //   name: '',
    // });
    const listLoading = ref(false);
    const SensorMessageList = ref([]);
    const orderField = ref('ts');
    const orderType = ref('desc');

     const handleSizeChange = (val) => {
      pageSize.value = val;
      fetchSensorData();
    };

    const handleCurrentChange = (val) => {
      currentPage.value = val;
      fetchSensorData();
    };

    const fetchSensorData = () => {
    const deviceIdKeyFromRoute = route.query.deviceIDKey;
    
    console.log("deviceIdKeyFromRoute:", deviceIdKeyFromRoute); 
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
       ...(deviceIdKeyFromRoute ? { deviceIdKey: deviceIdKeyFromRoute } : {}), 
      orderField: '',
      orderType: 'desc',
    };
    listLoading.value = true;
    axiosInstance.post(window.g.url + '/device/findMessage', params, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then((response) => {
    // 注意：您可能需要根据实际的API响应格式调整以下代码。
    if (response.data && response.data.SensorMessageList ) {  //去掉部分参数 && response.data.SensorMessageList.list
      total.value = response.data.SensorMessageList.totalCount;
      SensorMessageList.value = response.data.SensorMessageList.list;
      store.dispatch('setSensorMessageList', SensorMessageList.value);
      listLoading.value = false;

    } else {
      // console.log("Full API response:", response);
      console.error("Unexpected API response:", response.data);
      alert("数据加载失败，请稍后再试。"); // 提示用户
    }
  }).catch(error => {
    console.error("API request error:", error);
    listLoading.value = false;
    alert("出现错误，请检查网络连接或稍后再试。"); // 提示用户
    router.push('/login');
  });
}; 
    const returnback = () => {
      router.go(-1);
    };

    const tableSortChange = (column) => {
      orderField.value = column.prop;
      orderType.value = column.order === 'descending' ? 'desc' : 'asc';
      fetchSensorData();
    };

    const updateData = () => {
      const data = fetchData();
      store.dispatch('setSensorData', data);
    };

    onMounted(() => {
      fetchSensorData();
    });

    return {
      total,
      pageSize,
      currentPage,
      SensorMessageList,
      orderField,
      orderType,
      handleSizeChange,
      handleCurrentChange,
      fetchSensorData,
      returnback,
      tableSortChange,
      updateData
    };
  }
};

</script>

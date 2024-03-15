<template>
  <div>
  <div style="display: flex; align-items: center; justify-content: space-between; margin: 10px;">
      
    <!-- 下拉框和提示文本 -->
    <div style="display: flex; align-items: center;">

      <!-- :class="{ 'hidden-check': exceedsLimit }" -->
      <a-select 
        v-model:value="selectedProperties" 
        style="width: 400px;"
        placeholder="请选择要显示的属性（最多三个）"
        mode="multiple"
        :maxTagCount="3"
        :showArrow="true"
        allowClear
      >

        <a-select-option
            v-for="item of properties"
            :key="item.value"
            :value="item.value"
            :disabled="
                        
                        selectedItems && selectedItems.length === 3  && 
                        (selectedItems.findIndex(i=> i === item.value) === -1)
                        "
        >{{item.label}}         
        </a-select-option>
      </a-select>
    </div>
  </div>

  <div ref="echartsContainer" style="width: 1350px; height: calc(100vh - 210px);"></div>

  <el-row class="toolbar" style="position: fixed; bottom: 20px; width: 100%;">
      <el-col :span="6">
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20,40,100,200,500,1000,2000,5000,10000]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-col>
  </el-row>

 </div>
</template>

<script>
import { ref, onMounted, watch,computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import * as echarts from 'echarts';


const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  withCredentials: false,
});

export default {

  name: 'EChartsComponent', //定义Vue组件的名称为EChartsComponent

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore(); // 为了调用 Vuex 的方法
    const currentPage = ref(1);
    const total = ref(20);
    const pageSize = ref(50);


    const listLoading = ref(false);   //创建响应式引用，跟踪数据列表是否正在加载中
    const SensorMessageList = ref([]);  //存储从API或其他来源获取的消息列表
    const orderField = ref('ts');   //用于排序列表的字段，默认为时间戳（假设ts代表时间戳）
    const orderType = ref('desc');  //表示列表的排序类型

    const properties =ref([  //下拉多选框要选择的属性

      {label: '土壤PH', value: 'soilPh' },
      {label: '含水率1', value: 'waterContent1' },
      {label: '温度1',value:'temperature1'},
      {label: '土壤电导率1',value:'soilCondictivity1'},
      {label: 'Salinity1',value:'salinity1'},
      {label: 'Tds1',value:'tds1'},
      {label: '含水率2',value:'waterContent2'},
      {label: '温度2',value:'temperature2'},
      {label: '土壤电导率2',value:'soilCondictivity2'},
      {label: 'Salinity2',value:'salinity2'},
      {label: 'Tds2',value:'tds2'},
      {label: '含水率3',value:'waterContent3'},
      {label: '温度3',value:'temperature3'},
      {label: '土壤电导率3',value:'soilCondictivity3'},
      {label: 'Salinity3',value:'salinity3'},
      {label: 'Tds3',value:'tds3'},
      {label: '甲烷浓度',value:'methanePotency'},
      {label: '系统温度',value:'systemTemperature'},
      {label: '系统湿度',value:'systemHumidity'},
      {label: '自增量',value:'id'},
      // {label: '采集时间(int8)',value:'ts_partation'},
      {label: '土壤甲烷',value:'soilCh4'},
      {label: '土壤甲烷湿度',value:'soilCh4humi'},
      {label: '土壤甲烷温度',value:'soilCh4temp'},
      {label: '土壤温振温度',value:'soilWz3temp'},
      {label: '土壤温振X速度',value:'soilWz3xspeed'},
      {label: '土壤温振Y速度',value:'soilWz3yspeed'},
      {label: '土壤温振Z速度',value:'soilWz3zspeed'},
      {label: '土壤温振X位移',value:'soilWz3xdistance'},
      {label: '土壤温振Y位移',value:'soilWz3ydistance'},
      {label: '土壤温振Z位移',value:'soilWz3zdistance'},
      {label: '土壤温振X加速',value:'soilWz3xacc'},
      {label: '土壤温振Y加速',value:'soilWz3yacc'},
      {label: '土壤温振Z加速',value:'soilWz3zacc'},
 ]);
    const selectedProperties = ref([]);
    const selectedItems = computed(() => selectedProperties.value);


      // 页面大小（每页显示的数据数量）发生变化时被调用。它更新pageSize的值，并重新获取传感器数据
      const handleSizeChange = (val) => {
      pageSize.value = val;
      fetchSensorData();
    };

    //当前页码发生变化时被调用。它更新currentPage的值，并重新获取传感器数据 
    const handleCurrentChange = (val) => {
      currentPage.value = val;
      fetchSensorData();
    };


    //从API获取传感器数据
    const fetchSensorData = () => {
      
      //从当前路由的查询参数中获取deviceIDKey
      const deviceIdKeyFromRoute = route.query.deviceIDKey;
      
      //定义了一个对象params，这个对象将被传递到API调用中
      const params = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        //根据deviceIdKeyFromRoute的存在与否来动态添加deviceIdKey属性。
        ...(deviceIdKeyFromRoute ? { deviceIdKey: deviceIdKeyFromRoute } : {}), 
        orderField: '',
        orderType: 'desc',
      };

      //在发送API请求之前，将listLoading设置为true，可能用于显示加载指示器
      listLoading.value = true;

      //使用Axios发送一个POST请求到/device/findMessage端点
      axiosInstance.post(window.g.url + '/device/findMessage', params, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }).then((response) => {
      // 当请求成功完成时，处理响应数据,检查响应中是否有数据，并且是否有SensorMessageList属性
      if (response.data && response.data.SensorMessageList ) {  

        //从API响应中获取的SensorMessageList对象的list属性
        // const sensorDataList = response.data.SensorMessageList.list;
        total.value = response.data.SensorMessageList.totalCount;
        //SensorMessageList.value现在也包含了API返回的传感器消息列表
        SensorMessageList.value = response.data.SensorMessageList.list;
        // 将获取到的SensorMessageList保存到Vuex存储中
        store.dispatch('setSensorMessageList', SensorMessageList.value);

        // 更新xAxisData的值
        // xAxisData.value = sensorDataList.map(item => item.ts);

        } else {
        // console.log("Full API response:", response);
        console.error("Unexpected API response:", response.data);
        alert("数据加载失败，请稍后再试。"); // 提示用户
      }
    }).catch(error => {
      console.error("API request error:", error);
      listLoading.value = false;
      alert("出现错误，请检查网络连接或稍后再试。"); // 提示用户,如果发生错误，将用户重定向到登录页面
      router.push('/login');
    });
};
    //使浏览器返回上一页
    const goBack = () => {
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

    const echartsContainer = ref(null);
    const xAxisData = ref([]);  //响应式引用，其初始值为一个空数组

    

    const checkboxesState = (properties.value.map(() => false));   //引用的初始值是一个数组，它的长度与properties数组相同，并且每个元素

    watch([SensorMessageList, selectedProperties], (newVals) => {
    const [newSensorList, newSelectedProperties] = newVals;
  
    // 打印选中的属性到控制台
    console.log("选中的属性:", selectedProperties.value);


    if (echartsContainer.value) {
      let chart;
      // 如果已经初始化过，则直接获取该实例，否则进行初始化
      if (echarts.getInstanceByDom(echartsContainer.value)) {
        chart = echarts.getInstanceByDom(echartsContainer.value);
      } else {
        chart = echarts.init(echartsContainer.value);
      }

      // 清除图表的所有数据
      chart.clear();

      // 先从selectedProperties中获取前三个属性的数据
      const seriesData = selectedProperties.value.map(property => newSensorList.map(item => item[property]));

      // 使用模板对象构造series部分
      const series = seriesData.map((dataValue,index) => ({
          name: selectedProperties.value[index],
          data: dataValue,
          type: 'line',
          // stack: 'x',//用于数据堆叠
      }));

      chart.setOption({
        tooltip:{
          trigger:'axis'
        },
        xAxis: {
          data: newSensorList.map(item => item.tsPartation),
          axisLabel: {
            rotate: 330  // 使X轴上的标签垂直显示
          }
        },
        yAxis: {},
        // series: series,
        series:series
      });
    }
  });

      const handleCheckboxChange = () => {
      if (selectedProperties.value.length > 3) {
      const lastCheckedIndex = properties.findIndex(property => property.value === selectedProperties.value[selectedProperties.value.length - 1]);
      checkboxesState.value[lastCheckedIndex] = false;  // 取消选中
      selectedProperties.value.pop();  // 从selectedProperties中移除最后一个元素
    }
  };


    onMounted(() => {
      fetchSensorData();
      if(echartsContainer.value){
        const chart = echarts.init(echartsContainer.value);
        chart.clear();  // 清空图表
        // chart.setOption(option);
      }
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
      goBack,
      properties,
      tableSortChange,
      updateData,
      echartsContainer,
      // shouldDisableOption,
      selectedProperties,
      selectedItems,
      handleCheckboxChange,
      checkboxesState
    };
  }
}


</script>

<style>

.toolbar {
    background-color: #f9f9f9; /* 可以根据需要更改背景颜色 */
    padding: 10px 10px;
  }

</style>



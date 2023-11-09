<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="userManage" class="user-manage-tab"><UserManage/></el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus';
import UserManage from './userManage.vue';


const activeName = ref('userManage');

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
}
</script>

<style>

.el-main {
  padding: 0;
}

.el-tabs__nav {
    display: flex;
    white-space: nowrap;
    position: relative;
    transition: transform var(--el-transition-duration);
    float: left;
    z-index: calc(var(--el-index-normal) + 1);
    width: 100%;    /* 调整宽度为100% */
    height: 50px;   /* 设置高度为50px */
    padding: 10px;  /* 增加内边距 */
}

.el-tabs__item {
    padding: 10px 20px;  /* 调整每个标签的内边距 */
    font-size: 18px;    /* 调整字体大小 */
}

.el-tabs__item.is-active {
    color: var(--el-color-success-light-5);
}


</style>
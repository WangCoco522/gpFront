<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="300px">
        <div id="logo-system" class="logo-container">
          <img src="@/assets/images/logo.jpg" class="logo-icon" />
          <span>地下燃气管网监测系统</span>
        </div>
        <el-menu
        active-text-color="#FFFFFF"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >


        <el-menu-item index="1">
          <el-icon><DataAnalysis /></el-icon>
          <span class="SystemName">实时监控</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><location /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item-group title="配置管理">
            <el-menu-item index="2-1">传感器配置</el-menu-item>
            <el-menu-item index="2-2">通知设置</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="用户管理">
            <el-menu-item index="2-3">用户权限</el-menu-item>
            <el-menu-item index="2-4">操作日志</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="3">
          <el-icon><document /></el-icon>
          <span>报告与分析</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>Navigator Four</span>
        </el-menu-item>
        </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px"
              ><setting
            /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Setting, HomeFilled,DataAnalysis } from '@element-plus/icons-vue'

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: #FFFFFF;
  background: #304156;
}
.layout-container-demo .el-menu {
  color: #FFFFFF;
  background: #304156;
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.logo-container {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 10px 20px; /* 根据需要调整间距 */
  background: #304156; /* 和侧边栏背景色一致 */
  color: white; /* 字体颜色 */
  font-size: 20px;
  font-weight: bold;
}

.logo-icon {
  vertical-align: middle;
  margin-right: 8px;
  width: 24px; /* Logo图片的宽度 */
  height: 24px; /* Logo图片的高度 */
}

</style>
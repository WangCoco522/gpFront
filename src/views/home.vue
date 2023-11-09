<template>
  <div class="common-layout">
    <el-container>
      <el-header class="custom-header">地下燃气管网监测体系</el-header>
      <el-container>

        <el-aside width="200px">

          <el-menu
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#000"
          >
          
          
            
           <el-menu-item index="1">
              <router-link :to="{name:'sensorData'}" >
              <span>多维传感器数据上报</span>
              </router-link>
            </el-menu-item>
            

          <el-menu-item index="4">
          <router-link :to="{name:'setting'}" >
            <span>设置</span>
          </router-link>
          </el-menu-item>
          </el-menu>
          

        </el-aside>

        <el-main class="no-padding">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
    <div class="footer-container">
        <myFooter></myFooter>
    </div>
</template>


<style scope>
body, html {
    height: 100%;
    margin: 0;
}

element.style {
    --el-menu-text-color: #000;
    --el-menu-hover-text-color: #000;
    --el-menu-level: 0;
}

.common-layout {
    height: calc(100vh - 30px);
}


.common-layout .el-container{
        height:100%;
}

.custom-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px; 
  font-family: 'Arial', sans-serif; 
}


.el-aside{
  background-color:#66beff;
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0;
  overflow: auto;
  box-sizing: border-box;
  flex-shrink: 0;
  width: var(--el-aside-width,300px);
}

.el-menu {
    border-right: solid 1px var(--el-menu-border-color);
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: inherit; 
    box-sizing: border-box;
}

.el-aside .el-menu{
  width: 100%;
}

.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.el-menu-item span {
  flex:1;
  font-size: 18px;
}

.el-menu-item a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
}

.el-main {
    border: 1px solid #ccc; 
    padding: 20px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 简单的阴影效果 */
}

.footer-container {
    height: 30px; 
}

.el-link {
  margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}



</style>



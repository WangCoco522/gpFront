<template>
    <div class="center-container">
    <el-col :sm="12" :lg="6">
      <el-result 
        icon="error"
        title="404 page not found "
      >
      </el-result>
    </el-col>
    </div>
    <div>
            <myFooter></myFooter>
    </div>    
</template>


<style lang="scss" scoped>
    .center-container {
    display: flex;          // 设置为 flexbox 容器
    justify-content: center;  // 水平居中

    height: 100vh;          // 使用 viewport 高度确保它占据整个屏幕的高度
    }

    .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
</style>
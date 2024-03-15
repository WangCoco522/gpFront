<template>

    <div class="footer">本系统由中国科学院上海微系统与信息技术研究所开发</div>

</template>
<script>

    export default {
        name: 'myFooter',
    }

</script>
<style>
    body {
        padding-bottom: 50px;
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0px;
        width: 100%;
        height: 30px;
        background-color: #ffffff;
        z-index: 9999;
        color: #000000;
        text-align: center;
        line-height: 30px;
    }
</style>

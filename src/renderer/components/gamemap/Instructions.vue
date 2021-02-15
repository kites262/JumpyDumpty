<template>
    <div id="third-content">
        <span class="title">介绍</span>

        <span class="note">
            一个快捷的资源地图工具 /未完工

        </span>
        <span class="note">
            基于Electron + Vue + AntDesign开发

        </span>
        <a-divider />

        <!-- <a-button type="primary" @click="clickbutton">
            123
        </a-button> -->
    </div>
</template>

<script>
    // const {
    //     sendAxios
    // } = require('../../../main/getUserInfo.js')
    // import sendAxios from '../../../main/getUserInfo.js'
    export default {
        data() {
            return {

            }
        },
        methods: {
            // clickbutton() {
            //     sendAxios()
            // }
        }
    };
</script>

<style scoped>
    .title {
        font-size: 28px;
        font-weight: 500;
        margin-bottom: 28px;
        display: inline-block;
    }

    #third-content {
        padding: 50px;
        color: #404040;
        font-size: 14px;
    }

    .note {
        width: 100%;
        line-height: 21px;
        margin-bottom: 7px;
        display: inline-block;
    }
</style>
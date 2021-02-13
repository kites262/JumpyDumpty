<template>
    <div class="title" style="-webkit-app-region: drag">
        <div class="lt" style="-webkit-app-region: drag">
         
        </div>
        <div class="rt" style="-webkit-app-region: no-drag">
            <div class="icon">
                <span @click="minWin" class="gray">
                    <a-icon type="minus" class="i-min"  /></span>
                <span  @click="maxWin" class="gray">
                    <a-icon type="border" class="i-max" /></span>
                <span @click="exit">
                    <a-icon type="close" class="i-close"  /></span>

            </div>
        </div>
    </div>
</template>

<style scoped>
    .title {
        height: 32px;
        width: 100%;
    }

    .lt {
        float: left;
    }
    .rt {
        float: right;
    }
    .icon{
        font-size:0;
    }
    .icon span{
        font-size:14px;
        display: inline-block;
        width: 42px;
        box-sizing: border-box;
        padding-left: 14px;
        line-height: 32px;
        cursor: pointer;
    }
    .gray:hover{
        background-color: rgb(255, 211, 211);
    }
    .icon span:last-child:hover{
        color: rgb(255, 255, 255);
        background-color: rgba(197, 10, 10, 0.829);
    }
</style>

<script>
    import {remote} from 'electron'

    export default {
        name: 'myTitle',
        data() {
            return {
                isMax: false,
            }
        },
        methods:{
            exit(){
                //remote.app.quit()
                remote.getCurrentWindow().hide()
            },
            minWin(){
                remote.getCurrentWindow().minimize()
            },
            maxWin(){
                if (this.isMax){
                    remote.getCurrentWindow().unmaximize()
                    this.isMax = false
                }else {
                    remote.getCurrentWindow().maximize()
                    this.isMax = true
                }
            }
        }
    }
</script>
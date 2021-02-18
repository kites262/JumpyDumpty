<template>

    <div id="forth-content-cr">

        <span class="big-title">挑战回顾</span>

        <div style="background-color: #ececec; padding: 8px; max-width: 800px;">
            <a-row :gutter="[8,8]">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
                    <a-card title="最深抵达" :bordered="false">
                        <p>{{spiralAbyss.max_floor}}</p>
                        <!-- <span class="card-note">{{spiralAbyss.max_floor}}</span> -->
                    </a-card>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
                    <a-card title="战斗次数" :bordered="false">
                        <p>{{spiralAbyss.total_battle_times}}</p>
                    </a-card>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
                    <a-card title="获胜次数" :bordered="false">
                        <p>{{spiralAbyss.total_win_times}}</p>
                    </a-card>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
                    <a-card title="获得星数" :bordered="false">
                        <p>{{spiralAbyss.total_star}}</p>
                    </a-card>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
                    <a-card title="开始时间" :bordered="false">
                        <p>{{timestampToTime(spiralAbyss.start_time)}}</p>
                    </a-card>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
                    <a-card title="结束时间" :bordered="false">
                        <p>{{timestampToTime(spiralAbyss.end_time)}}</p>
                    </a-card>
                </a-col>
            </a-row>
        </div>

        

        <!-- <a-list item-layout="horizontal">
            <a-list-item v-for="(item,i) in spiralAbyss.reveal_rank" :key="i">
        
                <a-avatar :src="item.avatar_icon" />
            </a-list-item>
        </a-list> -->


    </div>

</template>

<style scoped>
    .big-title {
        font-size: 28px;
        font-weight: 500;
        margin-bottom: 28px;
        display: block;
    }

    .title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
        display: inline-block;
    }

    #forth-content-cr {
        overflow: auto;
        padding: 50px;
        padding-top: 30px;
        color: #404040;
        font-size: 14px;
        height: 100%;
        background-color: rgb(245, 245, 245);
    }

    #forth-content-cr::-webkit-scrollbar {
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    #forth-content-cr::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #e9b5b5;

    }

    #forth-content-cr::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }


    .note {
        width: 100%;
        /* margin-bottom: 7px; */
        display: inline-block;
    }

    .card-note {
        font-size: 14px;
    }
</style>

<script>
    const {
        ipcRenderer
    } = window.require("electron");

    import axios from 'axios'


    export default {
        data() {
            return {
                startTime: '',
                endTime: '',
                spiralAbyss: {}

            }

        },
        mounted() {
            this.getConfig()
        },
        methods: {
            getConfig() {
        
                  axios.get('../../../../data/spiralAbyssInfo.json').then(res => {
                    if (res.status === 200) {
                        this.spiralAbyss = res.data.data
                    }
                })
            },
            timestampToTime(timestamp) {
                let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';

                let D = (date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ');
                let h = (date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':');
                let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':');
                let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return Y + M + D + h + m + s;
            }
        }
    };
</script>
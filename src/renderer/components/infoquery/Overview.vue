<template>

    <div id="third-content-ov">
        <span class="big-title">数据总览</span>
        <span class="title">总览</span>
        <div id="overview-wrapper">

            <div class="card-wrapper">
                <div class="card-header">
                    活跃天数
                </div>
                <div class="card-container">
                    {{active_day_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    成就达成数
                </div>
                <div class="card-container">
                    {{achievement_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    风神瞳
                </div>
                <div class="card-container">
                    {{anemoculus_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    岩神瞳
                </div>
                <div class="card-container">
                    {{geoculus_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    获得角色数
                </div>
                <div class="card-container">
                    {{avatar_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    解锁传送点
                </div>
                <div class="card-container">
                    {{way_point_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    解锁秘境
                </div>
                <div class="card-container">
                    {{domain_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    深境螺旋
                </div>
                <div class="card-container">
                    {{spiral_abyss}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    华丽宝箱数
                </div>
                <div class="card-container">
                    {{precious_chest_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    珍贵宝箱数
                </div>
                <div class="card-container">
                    {{luxurious_chest_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    精致宝箱数
                </div>
                <div class="card-container">
                    {{exquisite_chest_number}}
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card-header">
                    普通宝箱数
                </div>
                <div class="card-container">
                    {{common_chest_number}}
                </div>
            </div>

        </div>
        <span class="title" style="margin-top: 15px;">世界探索</span>
        <div id="explorations-wrapper">
            <div class="explore-wrapper">

                <div class="explore-img" style="background-image: url('https://upload-bbs.mihoyo.com/game_record/genshin/city_icon/UI_ChapterIcon_Dragonspine.png');">
                </div>
                <div class="explore-container">
                    <div class="explore-container-header">
                        {{Dragonspine.name}}
                        <span class="explore-note"> 探索度{{Dragonspine.exploration_percentage/10}}%</span>

                    </div>
                    <a-progress class="explore-progress" :percent="Dragonspine.exploration_percentage/10" size="small" stroke-color="#CC3333"
                        :stroke-width="3" :show-info="false" />
                    <div class="explore-container-container">
                        供奉等级：{{Dragonspine.level}}级
                    </div>
                </div>
            </div>

            <div class="explore-wrapper">

                <div class="explore-img"
                    style="background-image: url('https://upload-bbs.mihoyo.com/game_record/genshin/city_icon/UI_ChapterIcon_Mengde.png');">

                </div>
                <div class="explore-container">
                    <div class="explore-container-header">
                        {{Mengde.name}}
                        <span class="explore-note"> 探索度{{Mengde.exploration_percentage/10}}%</span>

                    </div>
                    <a-progress class="explore-progress" :percent="Mengde.exploration_percentage/10" size="small" stroke-color="#CC3333"
                        :stroke-width="3" :show-info="false" />
                    <div class="explore-container-container">
                        声望等级：{{Mengde.level}}级
                    </div>
                </div>
            </div>

            <div class="explore-wrapper">

                <div class="explore-img"
                    style="background-image: url('https://upload-bbs.mihoyo.com/game_record/genshin/city_icon/UI_ChapterIcon_Liyue.png');">

                </div>
                <div class="explore-container">
                    <div class="explore-container-header">
                        {{Liyue.name}}
                        <span class="explore-note"> 探索度{{Liyue.exploration_percentage/10}}%</span>

                    </div>
                    <a-progress class="explore-progress" :percent="Liyue.exploration_percentage/10" size="small"
                        stroke-color="#CC3333" :stroke-width="3" :show-info="false" />
                    <div class="explore-container-container">
                        声望等级：{{Liyue.level}}级
                    </div>
                </div>
            </div>
        </div>


    </div>




    <!-- <a-divider /> -->
</template>

<script>
    const {
        ipcRenderer
    } = window.require("electron");

    import axios from 'axios'
    import vkeys from 'vkeys'




    export default {
        data() {
            return {
                active_day_number: '',
                achievement_number: '',
                // win_rate: '',
                anemoculus_number: '',
                geoculus_number: '',
                avatar_number: '',
                way_point_number: '',
                domain_number: '',
                spiral_abyss: '',
                precious_chest_number: '',
                luxurious_chest_number: '',
                exquisite_chest_number: '',
                common_chest_number: '',
                Liyue: {
                    level: '',
                    exploration_percentage: '',
                    name: '',
                },
                Mengde: {
                    level: '',
                    exploration_percentage: '',
                    name: '',
                },
                Dragonspine: {
                    level: '',
                    exploration_percentage: '',
                    name: '',
                }
            }

        },
        mounted() {
            this.getConfig()
            // 正确的初始化方式
            this.handleIPC()

        },
        methods: {
            getConfig() {
                axios.get('../../../../data/userInfo.json').then(res => {
                    if (res.status === 200) {
                        // world_explorations
                        this.active_day_number = res.data.data.stats.active_day_number
                        this.achievement_number = res.data.data.stats.achievement_number
                        this.anemoculus_number = res.data.data.stats.anemoculus_number
                        this.geoculus_number = res.data.data.stats.geoculus_number
                        this.avatar_number = res.data.data.stats.avatar_number
                        this.way_point_number = res.data.data.stats.way_point_number
                        this.domain_number = res.data.data.stats.domain_number
                        this.spiral_abyss = res.data.data.stats.spiral_abyss
                        this.precious_chest_number = res.data.data.stats.precious_chest_number
                        this.luxurious_chest_number = res.data.data.stats.luxurious_chest_number
                        this.exquisite_chest_number = res.data.data.stats.exquisite_chest_number
                        this.common_chest_number = res.data.data.stats.common_chest_number

                        this.Dragonspine.level = res.data.data.world_explorations[0].level
                        this.Dragonspine.exploration_percentage = res.data.data.world_explorations[0]
                            .exploration_percentage
                        this.Dragonspine.name = res.data.data.world_explorations[0].name

                        this.Mengde.level = res.data.data.world_explorations[1].level
                        this.Mengde.exploration_percentage = res.data.data.world_explorations[1]
                            .exploration_percentage
                        this.Mengde.name = res.data.data.world_explorations[1].name

                        this.Liyue.level = res.data.data.world_explorations[2].level
                        this.Liyue.exploration_percentage = res.data.data.world_explorations[2]
                            .exploration_percentage
                        this.Liyue.name = res.data.data.world_explorations[2].name
                    }
                })
            },

            clickbutton() {
                // ipcRenderer.send("map");
                console.log("clicked", vkeys.getKey(60))
            },
            handleIPC() {
                ipcRenderer.on('getInfoFinished', () => {
                    this.getConfig()
                })
            }
        }
    };
</script>

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

    #third-content-ov {
        overflow: auto;
        padding: 50px;
        padding-top: 30px;
        color: #404040;
        font-size: 14px;
        height: 100%;
        background-color: rgb(250,250,250);
    }
    #third-content-ov::-webkit-scrollbar {
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    #third-content-ov::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #e9b5b5;

    }

    #third-content-ov::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }

    #overview-wrapper {
        display: flex;
        flex-wrap: wrap
    }

    .card-wrapper {
        height: 80px;
        width: 160px;
        background-color: #fff;
        margin: 10px;
        margin-top: 0;
    }

    .card-header {
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        box-sizing: border-box;
        padding-left: 10px;
        border-bottom: rgb(220, 220, 220) 1px solid;
    }

    .card-container {
        font-size: 26px;
        font-weight: 400;
        text-align: right;
        box-sizing: border-box;
        padding-right: 20px;
    }



    .explore-wrapper {

        height: 80px;
        width: 256px;
        background-color: #ec6e6ebd;
        margin: 10px;
        margin-top: 0;
    }

    .explore-img {
        float: left;
        height: 80px;
        width: 80px;
        background-size: 75px;
        background-position: 50% 20%;
    }

    .explore-container {
        position: relative;
        float: left;
        width: 165px;
        /* width: 100%; */
        /* width: calc(100%-80px); */

        height: 80px;
        /* background-color: #fff; */
    }

    .explore-note {
        text-align: right;
        float: right;
        display: block;
    }

    .explore-progress {
        position: absolute;
        top: 19px;
    }

    #explorations-wrapper {
        display: flex;
        flex-wrap: wrap
    }

    .explore-container-header {
        color: rgb(250, 250, 250);
        width: 100%;
        height: 25px;
        line-height: 25px;
        box-sizing: border-box;
        padding-top: 2px;
    }

    .explore-container-container {
        color: #e27e7e;
        text-align: center;
        height: 30px;
        line-height: 30px;
        margin-bottom: 5px;
        margin-top: 15px;
        background-color: #ffefef;
    }

 

    .note {
        width: 100%;
        margin-bottom: 7px;
        display: inline-block;
    }


</style>
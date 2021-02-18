<template>

    <div id="third-content-sa-wrapper">
        <a-layout id="third-content-sa">


            <a-layout-sider id="third-sider" :trigger="null" collapsible
                style="max-width:160px; min-width:160px; width: 160px;flex:0 0 160px">
                <div id="menu-wrapper" style="width: 160px;">
                    <a-menu mode="inline" :default-selected-keys="['1']" :default-open-keys="['sub1','sub2']"
                        style="background-color: rgb(250, 250, 250);">
                        <a-menu-item key="1" @click="()=>{
                            this.$router.push('/infoquery/spiralabyss/combatreview')
        }">

                            挑战回顾
                        </a-menu-item>

                        <a-sub-menu key="sub1">
                            <span slot="title">
                                <span> 数据排行</span>
                            </span>

                            <a-menu-item @click="getRank('reveal_rank')" style="height: 40px; padding-left: 40px; ">
                                出战次数
                            </a-menu-item>
                            <a-menu-item @click="getRank('defeat_rank')" style="height: 40px; padding-left: 40px; ">
                                击破数
                            </a-menu-item>
                            <a-menu-item @click="getRank('damage_rank')" style="height: 40px; padding-left: 40px; ">
                                最大伤害
                            </a-menu-item>
                            <a-menu-item @click="getRank('take_damage_rank')"
                                style="height: 40px; padding-left: 40px; ">
                                承受伤害
                            </a-menu-item>
                            <a-menu-item @click="getRank('normal_skill_rank')"
                                style="height: 40px; padding-left: 40px; ">
                                元素战技次数
                            </a-menu-item>
                            <a-menu-item @click="getRank('energy_skill_rank')"
                                style="height: 40px; padding-left: 40px; ">
                                元素爆发次数
                            </a-menu-item>

                        </a-sub-menu>

                        <a-sub-menu key="sub2">
                            <span slot="title">
                                <span> 详细战绩</span></span>
                            <a-menu-item v-for="(item,i) in spiralAbyss.floors" @click="getfloor(item.index)" :key="i"
                                style="height: 40px; padding-left: 40px; position: relative;">

                                <div class="floor-name"> 第{{item.index}}层</div>
                                <!-- <div class="floor-star">
                                    <a-icon type="star" theme="twoTone" two-tone-color="orange" v-for="(itemStar,i) in item.star" style="font-size: 12px;"
                                    :key="i" />
                                    {{item.star}}</div>

                                <div class="char-element"> {{item.max_star}}</div>
                                <div class="char-level"> Lv.{{item.level}}</div> -->
                            </a-menu-item>

                        </a-sub-menu>

                    </a-menu>
                </div>

            </a-layout-sider>
            <a-layout id="forth-content">
                <a-layout-content :style="{ margin: '0', padding: '0', background: '#fff', minHeight: '280px' }">
                    <router-view v-if="ifRouterView">Content</router-view>
                </a-layout-content>
            </a-layout>


        </a-layout>
    </div>




    <!-- <a-divider /> -->
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

    #third-sider {
        height: 100%;
        box-sizing: border-box;
        padding-top: 40px;
        width: 100px;
        overflow: auto;
        background-color: rgb(250, 250, 250);
    }

    /* #menu-wrapper{
        background-color: rgb(255, 22, 22);
    } */

    #forth-content {
        overflow: auto;
    }

    #forth-content::-webkit-scrollbar {
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }




    #forth-content::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #e9b5b5;

    }

    #forth-content::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }


    #third-sider::-webkit-scrollbar {
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }




    #third-sider::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #e9b5b5;

    }

    #third-sider::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }




    #third-content-sa-wrapper {
        width: 100%;
        height: 100%;
    }

    #third-content-sa {
        width: 100%;
        height: 100%;
    }

    .note {
        width: 100%;
        margin-bottom: 7px;
        display: inline-block;
    }
</style>

<script>


    import axios from 'axios'
    import vkeys from 'vkeys'




    export default {

        mounted() {
            this.getData()
            // 正确的初始化方式
    

        },
        methods: {
            getData() {
                axios.get('../../../../data/spiralAbyssInfo.json').then(res => {
                    if (res.status === 200) {
                        this.spiralAbyss = res.data.data
                        if (res.data.data.total_battle_times == 0){
                            this.$notification['warning']({
                                    message: '注意',
                                    description: '该玩家暂未进行本期深境螺旋挑战',
                                    duration: 4.5,
                                });
                        }
                    }
                })
            },
            getRank(value) {
                this.$router.push({
                    path: '/infoquery/spiralabyss/dataranking/' + value
                })
                this.ifRouterView = false
                this.$nextTick(() => {
                    this.ifRouterView = true
                })
            },
            getfloor(value) {
                this.$router.push({
                    path: '/infoquery/spiralabyss/floordetail/' + value
                })
                this.ifRouterView = false
                this.$nextTick(() => {
                    this.ifRouterView = true
                })
            },
        },
        data() {
            return {
                ifRouterView: true,
                spiralAbyss: {}
               
            }

        },
    };
</script>
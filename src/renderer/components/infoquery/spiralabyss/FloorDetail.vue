<template>
    <div id="forth-content-fd">
        <span class="big-title">深境螺旋 第{{floorID}}层</span>


        <span class="star-words">
            <span style="font-size: 22px;">获得渊星</span>
            <a-icon type="star" theme="filled" style="font-size: 26px;color: rgb(255, 136, 136);"></a-icon>：
            {{floor.star}} / {{floor.max_star}}
        </span>

  


        <div id="levels-wrapper">
            <div class="level-wrapper" v-for="(itemLevel,iL) in floor.levels" :key="iL">
                <div class="level-item">
                    <div class="level-title">第{{itemLevel.index}}间</div>
                    <div class="level-star" style="font-size: 0px;">
                        <a-icon type="star" theme="filled" style="font-size: 26px;color: rgb(255, 136, 136);"
                            v-for="(itemLevelStar,iS1) in itemLevel.star" :key="iS1" />
                        <a-icon type="star" theme="filled" style="font-size: 26px;color: rgba(153, 86, 86, 0.192);"
                            v-for="(itemLevelStar,iS2) in itemLevel.max_star-itemLevel.star" :key="'max'+iS2" />
                    </div>
                    <div class="battle-wrapper" v-for="(itemBattle,iB) in itemLevel.battles" :key="iB">
                        <div class="battle-item">
                            <div class="battle-time" style="margin-bottom: 5px;margin-top: 15px;">
                                {{timestampToTime(itemBattle.timestamp)}}
                            </div>

                            <div id="battle-cards-wrapper">
                                <a-row :gutter="[8,24]">
                                    <div class="battle-card-wrapper" v-for="(itemChar,iA) in itemBattle.avatars" :key="iA">
                                        <a-col :span="6">
                                            <a-card class="char-card" hoverable>
                                                <img class="char-card-icon" slot="cover" alt="example"
                                                    :src="itemChar.icon" />
                                                <div class="char-card-container" style="position: relative;">
                                                    <div class="char-card-title">
                                                        {{idToName[itemChar.id]}}
                                                    </div>
                                                    <div class="char-card-right">
                                                        Lv.{{itemChar.level}}
                                                    </div>
                                                </div>

                                            </a-card>
                                        </a-col>
                                    </div>
                                </a-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>




    </div>
</template>
<style scoped>
    .big-title {
        height: 35px;
        font-size: 28px;
        font-weight: 500;
        margin-bottom: 28px;
        display: block;
        overflow: hidden;
    }

    .title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
        display: inline-block;
    }

    .explain {
        font-weight: 300;
        font-size: 13px;
        margin-bottom: 28px;
        display: block;
    }

    .star-words {
        display: inline-block;
        margin-top: 10px;
        font-weight: 300;
        font-size: 24px;
        line-height: 28px;
        margin-bottom: 30px;
    }

    #forth-content-fd {
        padding: 25px;
        padding-top: 30px;
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgb(245, 245, 245);
        overflow: auto;
        /* z-index: -1; */
    }

    .level-wrapper {
        background-color: rgb(240, 240, 240);
        padding: 15px;
        margin-bottom: 40px;
        max-width: 780px;
    }

    .level-item {
        position: relative;
    }

    .level-title {
        font-size: 22px;
        margin-bottom: 10px;
    }

    .level-star {
        position: absolute;
        right: 0px;
        top: 3px;
    }


    .char-card-icon {
        background-color: rgba(228, 228, 228, 0.363);
    }

    #battle-cards-wrapper {
        max-width: 960px;
    }

    .char-card {
        min-width: 150px;
        max-width: 180px;
    }

    .char-card-title {
        margin-bottom: 0px;
    }


    .char-card-right {
        position: absolute;
        right: 0px;
        top: 0px;
        font-size: 18px;
        line-height: 20px;
        font-weight: 500;
        text-align: right;
    }

    .char-card-title {
        font-size: 16px;
        font-weight: 500;
    }

    #forth-content-fd::-webkit-scrollbar {
        width: 8px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    #ranking-lists-wrapper {
        max-width: 760px;
        min-width: 230px;
        overflow: hidden;
    }

    .list-title {
        position: absolute;
        top: 30px;
        left: 80px;
        font-size: 16px;
    }

    .list-stars {
        position: absolute;
        top: 55px;
        left: 80px;
    }

    .list-container {
        position: relative;
        top: 20px;
        font-size: 16px;
        font-weight: 500;
    }

    #forth-content-fd::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #ffababea;

    }

    #forth-content-fd::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;

    }
</style>

<script>
    import axios from 'axios'

    export default {
        mounted() {

            this.getData()
        //   this.initData()
            // 正确的初始化方式
        },
        data() {
            return {
                floorID: this.$route.params.value,
                idToName: {},
                floor: {},
                charsInfo: [],
                spiralAbyss:{}
            }
        },
        methods: {
            getData() {
                axios.get('../../../../data/userInfo.json').then(res => {
                    if (res.status === 200) {
                        this.charsInfo = res.data.data.avatars
                        // console.log(this.charsInfo)
                    }
                })
                axios.get('../../../../data/spiralAbyssInfo.json').then(res => {
                    if (res.status === 200) {
                        this.spiralAbyss = res.data.data
                        this.initData()
                    }
                })
            },
            initData() {
                for (let item of this.charsInfo) {
                    this.idToName[item.id] = item.name
                }

                for (let itemFloor of this.spiralAbyss.floors) {
                    if (itemFloor.index == this.floorID) {
                        this.floor = itemFloor
                    }
                }
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
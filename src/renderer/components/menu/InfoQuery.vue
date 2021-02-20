<template>
    <div style="height: 100%;">
        <a-layout id="second-content">


            <a-layout-sider id="second-sider" :trigger="null" collapsible
                style="max-width: 256px; width: 256px;flex:0 0 256px">

                <div id="search-wrapper">
                    <a-input-search id="id-search" placeholder="请输入ID" enter-button @search="getInfo" />
                </div>
                <div id="menu-wrapper">
                    <a-menu mode="inline" :default-selected-keys="['1']" :default-open-keys="['sub1']">
                        <a-menu-item key="1" @click="()=>{
            this.$router.push('/infoquery/overview')
        }">
                            <a-icon type="read" />
                            数据总览
                        </a-menu-item>

                        <a-menu-item key="3" @click="()=>{
                            this.$router.push('/infoquery/spiralabyss')
        }">
                            <a-icon type="info-circle" />
                            深渊战绩
                        </a-menu-item>

                        <a-sub-menu key="sub1">
                            <span slot="title">
                                <a-icon type="team" /><span> TA的角色</span></span>
                            <a-menu-item v-for="(role,i) in characters" @click="getDetail(role.id)" :key="i"
                                style="height: 64px; padding-left: 40px; position: relative;">

                                <a-avatar class="char-img" :src="role.image" :size="48"
                                    :style="role.rarity==4?'background-color: #876ab1;':'background-color: #ca884e;'" />
                                <div class="char-name"> {{role.name}}</div>
                                <div class="char-fetter"> 好感度：{{role.fetter}}</div>

                                <div class="char-element"> {{role.element}}</div>
                                <div class="char-level"> Lv.{{role.level}}</div>
                            </a-menu-item>

                        </a-sub-menu>




                    </a-menu>
                </div>

            </a-layout-sider>
            <a-layout id="third-content">
                <my-title id="my-title"></my-title>
                <a-layout-content :style="{ margin: '0', padding: '0', background: '#fff', minHeight: '280px' }">
                    <router-view v-if="ifRouterView">Content</router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    const {
        ipcRenderer
    } = window.require("electron");

    import myTitle from '../coms/Title.vue'
    import axios from 'axios'

    export default {
        data() {
            return {
                ifRouterView: true,
                characters: [],
            }
        },
        mounted() {
            this.readData()

        },
        components: {
            myTitle
        },
        methods: {
            readData() {
                axios.get('../../../../data/userInfo.json').then(res => {
                    if (res.status === 200) {
                        // console.log(res.data.data.avatars)
                        this.characters = res.data.data.avatars
                        this.handleData()
                    }
                })
            },
            handleData() {
                for (let item of this.characters) {
                    console.log("handle")
                    if (item.element == "None") {
                        item.element = "无属性"
                    } else if (item.element == "Anemo") {
                        item.element = "风"
                    } else if (item.element == "Pyro") {
                        item.element = "火"
                    } else if (item.element == "Geo") {
                        item.element = "岩"
                    } else if (item.element == "Electro") {
                        item.element = "雷"
                    } else if (item.element == "Cryo") {
                        item.element = "冰"
                    } else if (item.element == "Hydro") {
                        item.element = "水"
                    } else {
                        item.element = "草"
                    }
                }
            },
            getInfo(value) {
                if (value) {
                    this.handleIPC()
                    this.$router.push({
                        path: '/infoquery'
                    })
                    ipcRenderer.send("getInfo", value)
                }
            },
            getDetail(charID) {
                this.$router.push({
                    path: '/infoquery/chardetail/' + charID
                })
                this.ifRouterView = false
                this.$nextTick(() => {
                    this.ifRouterView = true
                })
            },
            handleIPC() {
                ipcRenderer.once('getInfoFinished', () => {
                    axios.get('../../../../data/userInfo.json').then(res => {
                        if (res.status === 200) {
                            console.log("获取信息结束")
                            if (res.data.retcode == 0) {
                                this.$notification['success']({
                                    message: '查询成功',
                                    description: '已获取该用户所有信息',
                                    duration: 4.5,
                                })
                            } else if (res.data.retcode == 10102) {
                                this.$notification['error']({
                                    message: '查询失败',
                                    description: '该用户数据未公开',
                                    duration: 4.5,
                                });
                            } else if (res.data.retcode == 1008) {
                                this.$notification['error']({
                                    message: '查询失败',
                                    description: '用户信息不匹配，请检查UID是否输入正确',

                                    duration: 4.5,
                                });
                            } else if (res.data.retcode == 10001) {
                                this.$notification['error']({
                                    message: '查询失败',
                                    description: '请在程序设置中先设置你的Cookie，或设置的Cookie不正确',
                                    duration: 4.5,
                                });
                            } else if (res.data.retcode == -1) {
                                this.$notification['error']({
                                    message: '查询失败',
                                    description: '参数不正确',
                                    duration: 4.5,
                                });
                            } else {
                                this.$notification['error']({
                                    message: '查询失败',
                                    description: '未知错误，返回消息为' + JSON.stringify(res.data, null),
                                    duration: 4.5,
                                });
                            }
                            this.characters = res.data.data.avatars
                            this.handleData()
                        }
                    })
                })
            }
        }
    };
</script>

<style scoped>
    #search-wrapper {
        width: 256px;
        height: 72px;
        box-sizing: border-box;
        padding-top: 32px;
        padding-left: 10px;
        background-color: rgb(250, 250, 250);
    }

    #id-search {
        height: 40px;
    }

    #menu-wrapper {
        overflow: auto;
        height: calc(100% - 72px);
    }

    #menu-wrapper::-webkit-scrollbar {
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    #menu-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #e9b5b5;

    }

    #menu-wrapper::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;
    }

    .char-img {
        /* float: left; */
        position: absolute;
        top: 10px;

    }

    .char-name {
        font-size: 16px;
        position: absolute;
        top: 2px;
        left: 100px;
        font-weight: 500;
        width: 80px;
        height: 40px;
    }

    .char-level {
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        width: 60px;
        height: 40px;
        position: absolute;
        top: 30px;
        left: 190px;
    }

    .char-fetter {
        font-weight: 300;
        font-size: 12px;
        position: absolute;
        width: 40px;
        height: 40px;
        top: 30px;
        left: 100px;
    }

    .char-element {
        font-size: 13px;
        text-align: right;
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0px;
        left: 195px;

    }

    #my-title {
        background-color: rgb(250, 250, 250);
    }

    #second-content {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    #second-sider {
        height: 100%;

        background-color: #ffffff;
    }

    #third-content {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: rgb(250, 250, 250);
    }
</style>
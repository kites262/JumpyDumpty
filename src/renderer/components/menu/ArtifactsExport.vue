<template>
    <div id="second-content-wrapper">
        
        <a-layout id="second-content">
            <a-layout-sider id="second-sider" :trigger="null" collapsible
                style="max-width: 200px; width: 200px;flex:0 0 200px">
                <a-menu mode="inline" :default-selected-keys="['1']">

                    <a-menu-item key="1" @click="()=>{
                        this.$router.push('/artifactsexport/ocrsetting')
                    }">
                        <a-icon type="setting" />
                        API设置
                    </a-menu-item>
                    <a-menu-item key="2" @click="()=>{
                        this.$router.push('/artifactsexport/ocrmain')
                    }">
                        <a-icon type="interaction" />
                        圣遗物抓取
                    </a-menu-item>
                    <!-- <a-menu-item key="3" @click="()=>{
                        this.$router.push('/artifactsexport/instructions')
                    }">
                        <a-icon type="info-circle" />
                        功能说明
                    </a-menu-item> -->


                </a-menu>
            </a-layout-sider>
            <a-layout id="third-content">
                <my-title id="my-title" style="margin:0;"></my-title>
                <a-layout-content :style="{ margin: '0', padding: '0', background: '#fff', minHeight: '280px' }">
                    <router-view>Content</router-view>
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
                apiName: 'accurate',
                apiKeyValue: "",
                secretKeyValue: "",
                accessTokenValue: '',
                ifAutoCookieButton: false,
            }
        },
        mounted() {
            this.getConfig()
            this.handleIPC()
        },
        components: {
            myTitle
        },
        methods: {
            getConfig() {
                axios.get('../../../../config/ocrConfig.json').then(res => {
                    if (res.status === 200) {
                        if (res.data.api) {
                            if (res.data.api ==
                                "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=") {
                                this.apiName = "accurate"
                            } else {
                                this.apiName = "general"
                            }
                        }
                    }
                })
                axios.get('../../../../config/baiduToken.json').then(res => {
                    if (res.status === 200) {
                        if (res.data.access_token) {
                            this.accessTokenValue = res.data.access_token
                        }
                    }
                })
            },
            onAutoCookieSwitchChange(checked) {
                if (checked) {
                    this.ifAutoCookieButton = true
                } else {
                    this.ifAutoCookieButton = false
                }
                ipcRenderer.send("writeifAutoCookie", this.ifAutoCookieButton);
            },


            artifactsCatch() {
                ipcRenderer.send("artifactsCatch");
                ipcRenderer.once('artifactsCatchFinished', () => {
                    axios.get('../../../../data/ocrData.json').then(res => {
                        if (res.status === 200) {
                            if (res.data.words_result_num < 8) {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: 'OCR返回结果过少，请检查游戏分辨率和打开的界面是否正确，返回的相关信息保存在目录的data文件夹下',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code == '216202') {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: '图片尺寸存在问题，请检查游戏是否保持前台，返回的相关信息保存在目录的data文件夹下',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code == '18') {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: 'OCR申请过于频繁，请减慢点击速度',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code) {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: '未知错误，返回消息为' + res.data.data,
                                    duration: 4.5,
                                });
                            } else {
                                this.$notification['success']({
                                    message: '抓取圣遗物成功',
                                    description: '已保存在当前目录的data/artifacts.json',
                                    duration: 4.5,
                                });
                            }
                        }
                    })


                })
            },
            artifactsReset() {
                ipcRenderer.send("artifactsReset");
                ipcRenderer.once('artifactsResetFinished', () => {
                    this.$notification['success']({
                        message: '重置成功',
                        description: '已清除所有圣遗物',
                        duration: 4.5,
                    });
                })

            },
            handleApiChange(value) {
                this.apiName = value
                if (value == "accurate") {
                    ipcRenderer.send("writeApi",
                        "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=")
                } else {
                    ipcRenderer.send("writeApi", "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=")
                }
            },
            getAccessToken() {
                ipcRenderer.send("getAccessToken",
                    this.apiKeyValue, this.secretKeyValue)
                ipcRenderer.once('getAccessTokenFinished', () => {
                    axios.get('../../../../config/baiduToken.json').then(res => {
                        if (res.status === 200) {
                            if (res.data.access_token) {
                                this.accessTokenValue = res.data.access_token
                                this.$notification['success']({
                                    message: '获取AccessToken成功',
                                    description: this.accessTokenValue,
                                    duration: 4.5,
                                });
                            } else {
                                this.$notification['errror']({
                                    message: '获取AccessToken失败',
                                    description: res.data,
                                    duration: 4.5,
                                });
                            }
                        }
                    })
                })
            },
            saveAccessToken() {
                ipcRenderer.send("saveAccessToken", this.accessTokenValue)
            },

            handleIPC() {
                ipcRenderer.removeAllListeners('artifactsCatchFinished')
                ipcRenderer.removeAllListeners('getAccessTokenFinished')
                ipcRenderer.removeAllListeners('expoetToClicpBoardFinished')
                ipcRenderer.removeAllListeners('artifactsResetFinished')
                ipcRenderer.removeAllListeners('ocrShotCutOpen')
                ipcRenderer.removeAllListeners('ocrShotCutClose')
                ipcRenderer.on('ocrShotCutOpen', () => {
                    this.$notification['success']({
                        message: '已开启热键',
                        description: '请点击鼠标以抓取圣遗物',
                        duration: 4.5,
                    });
                })
                ipcRenderer.on('ocrShotCutClose', () => {
                    this.$notification['success']({
                        message: '已关闭热键',
                        description: '可导出圣遗物',
                        duration: 4.5,
                    });
                })
                ipcRenderer.on('ocrShotCutWorking', () => {
                    this.$notification['success']({
                        message: 'OCRing',
                        // description: '',
                        duration: 0.8,
                    });
                })

            },
            expoetToClicpBoard() {
                ipcRenderer.send("expoetToClicpBoard")
                ipcRenderer.once('expoetToClicpBoardFinished', () => {
                    this.$notification['success']({
                        message: '导出json成功',
                        description: '详情请在剪贴板查看',
                        duration: 4.5,
                    });
                })

            },
      
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

    .note {
        width: 100%;
        margin-bottom: 7px;
        display: inline-block;
    }

    .explain {
        font-weight: 300;
        font-size: 13px;
        margin-bottom: 28px;
        display: block;
    }

    .default-input {
        width: 70%;
        max-width: 800px;
        min-width: 200px;
        overflow: hidden;
    }
    #second-content{
        height: 100%;
    }
    #second-sider{
        height: 100%;
        background-color: #fff;
    }
    #second-content-wrapper {
        background-color: rgb(250, 250, 250);
        height: 100%;
        overflow: auto;
    }

    #second-content-wrapper::-webkit-scrollbar {
        width: 8px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }



    #second-content-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #ffababea;

    }

    #second-content-wrapper::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;

    }

    #container {
        padding-top: 20px;
        padding: 40px;
    }
    #my-title{
        background-color: rgb(250,250,250);
        margin-bottom: 0;
    }
</style>
<template>
    <div id="second-content-wrapper">
        <myTitle></myTitle>
        <div id="container">

            <span class="big-title">圣遗物OCR导出</span>
            <span class="title">API</span>
            <span class="note">设置你的API</span>

            <div>
                <a-select id="api-select" default-value="accurate" :value="apiName" style="width: 256px"
                    @change="handleApiChange">
                    <a-select-option value="general">
                        标准版
                    </a-select-option>
                    <a-select-option value="accurate">
                        高精度版
                    </a-select-option>
                </a-select>
            </div>

            <!-- <a-divider /> -->

            <div style="margin-bottom: 5px">
                <div>
                    <span class="note">输入你的API Key</span>
                    <div class="defaule-input">
                        <a-input placeholder="请输入API Key" v-model="apiKeyValue" style="width: 100%" />
                    </div>

                </div>
            </div>

            <div style="margin-bottom: 5px">
                <div>
                    <span class="note">输入你的Secret Key</span>
                    <div class="defaule-input">
                        <a-input placeholder="请输入Secret Key" v-model="secretKeyValue" style="width: 100%" />
                    </div>


                </div>
            </div>

            <a-button type="primary" @click="getAccessToken" style="margin-bottom: 5px">
                获取Access Token
            </a-button>

            <div style="margin-bottom: 5px">
                <div class="defaule-input">
                    <a-input placeholder="请输入你的Access Token" v-model="accessTokenValue" @change="saveAccessToken" />
                </div>
            </div>

            <span class="explain">Access Token获取方法请自行参考百度OCR官网，此处填入API Key和Secret Key获取即可</span>

            <!-- <span class="note">热键抓取开关</span>
            <div class="hot-key-switch">
                <a-switch @change="onAutoCookieSwitchChange" :checked="ifAutoCookieButton" />
            </div> -->


            <a-button type="primary" @click="artifactsCatch">
                点我手动抓取屏幕并OCR
            </a-button>

            <a-button type="primary" @click="artifactsReset">
                点我重置圣遗物
            </a-button>

            <a-button type="primary" @click="expoetToClicpBoard">
                点我导出圣遗物json
            </a-button>

            <span class="title" style="display: block;margin-top: 24px;">热键</span>
            <span class="note">圣遗物抓取热键</span>
            <a-button type="primary">
                Alt+R
            </a-button>
            <span class="explain">热键已注册，按下热键，逐个点击圣遗物即可。程序会自动捕捉鼠标点击事件并进行截图OCR识别。</span>
            <span class="explain" style="margin: 0;">（自定义热键功能和浮窗提醒施工中...）</span>
        </div>
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
</style>
<template>
    <div id="thirs-content-wrapper-st">

        <div id="container">

            <span class="big-title">API相关设置</span>
            <span class="title">API</span>
            <span class="note">设置你的API接口</span>

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

            <a-divider />

            <span class="title">Access Token</span>
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

            <a-button type="primary" @click="getAccessToken" style="margin-bottom: 5px;margin-top:15px;">
                获取Access Token
            </a-button>

            <div style="margin-bottom: 5px">
                <div class="defaule-input">
                    <a-input placeholder="请输入你的Access Token" v-model="accessTokenValue" @change="saveAccessToken" />
                </div>
            </div>

            <span class="explain" style="margin-top: 30px;">Access Token获取方法请自行参考百度OCR官网，此处填入API Key和Secret Key获取即可</span>


        </div>
    </div>
</template>

<script>
    const {
        ipcRenderer
    } = window.require("electron");

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

    #thirs-content-wrapper-st {
        background-color: rgb(250, 250, 250);
        height: 100%;
        overflow: auto;
    }

    #thirs-content-wrapper-st::-webkit-scrollbar {
        width: 8px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }



    #thirs-content-wrapper-st::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #ffababea;

    }

    #thirs-content-wrapper-st::-webkit-scrollbar-track {
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
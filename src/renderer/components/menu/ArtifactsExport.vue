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

            <span class="explain">access-token获取方法请自行参考百度OCR官网</span>

            <!-- <span class="note">热键抓取开关</span>
            <div class="hot-key-switch">
                <a-switch @change="onAutoCookieSwitchChange" :checked="ifAutoCookieButton" />
            </div> -->

            <!-- <span class="explain">按下热键，逐个点击圣遗物即可。程序会自动捕捉鼠标点击事件并进行截图OCR识别。</span> -->

            <a-button type="primary" @click="artifactsCatch">
                点我抓取屏幕
            </a-button>


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
                                console.log(this.apiName, '111')
                            } else {
                                this.apiName = "general"
                                console.log(this.apiName, '222')
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
            saveCookie() {
                ipcRenderer.send("writeCookie", this.cookieValue);
            },

            artifactsCatch() {
                ipcRenderer.send("artifactsCatch");
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
            },
            saveAccessToken() {
                ipcRenderer.send("saveAccessToken", this.accessTokenValue)
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
    }

    #container {
        padding-top: 20px;
        padding: 40px;
    }
</style>
<template>
    <div id="second-content-wrapper-om">


        <div id="container">

            <span class="big-title">抓取操作</span>
            <span class="title">手动模式</span>
            <span class="note">点击按钮手动进行OCR识别</span>

            <a-button type="primary" @click="artifactsCatch">
                抓取屏幕并OCR识别
            </a-button>




            <a-divider />


            <span class="title" style="display: block;margin-top: 24px;">热键模式</span>

            <span class="note">自定义快速抓取模式热键</span>
            <a-button type="primary" @keydown="writeKey" @blur="sendKey">
                {{hotKey}}
            </a-button>
            <span class="explain" style="margin-top: 14px;margin-bottom: 5px;">仅支持双键组合</span>

            <span class="explain"
                style="margin-bottom: 15px;">热键已注册，按下热键，逐个点击圣遗物即可。程序会自动捕捉鼠标点击事件并进行截图OCR识别。</span>

            <span class="note">防止重复录入</span>
            <div class="dereplication-switch">
                <a-switch @change="onDereplicationChange" :checked="ifDereplication" />
            </div>
            <span class="explain"
            style="margin-bottom: 10px;margin-top:5px;">已存储的圣遗物将不再录入</span>

            <a-divider />

            <span class="title">重置</span>
            <span class="note">点击按钮清空圣遗物</span>

            <div>
                <a-button type="primary" @click="artifactsReset">
                    清空保存的所有圣遗物
                </a-button>
            </div>


            <a-divider />
            <span class="title">导出</span>
            <!-- <span class="note">点击按钮导出圣遗物</span> -->
            <div>
                <a-button type="primary" @click="expoetToClicpBoard">
                    导出Json到剪贴板
                </a-button>
            </div>

        </div>
    </div>
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
                ifAutoCookieButton: false,
                ifDereplication: true,
                correctHotKey: true,
                hotKey: "Alt+R"
            }
        },
        mounted() {
            this.getConfig()
            this.handleIPC()
        },
        methods: {

            onDereplicationChange(checked) {
                if (checked) {
                    this.ifDereplication = true
                } else {
                    this.ifDereplication = false
                }
                ipcRenderer.send("writeIfDereplication", this.ifDereplication);
            },
            writeKey(e) {
                this.correctHotKey = false
                let key = vkeys.getKey(e.keyCode) //得到输入的具体按键名称
                key = key.replace(key[0], key[0].toUpperCase())
                if (e.keyCode == 17) { //输入ctrl
                    this.hotKey = "Ctrl+"
                } else if (e.keyCode == 18) { //输入alt
                    this.hotKey = "Alt+"
                } else {
                    if (this.hotKey == "Ctrl+") {
                        this.hotKey = "Ctrl+" + key
                    } else if (this.hotKey == "Alt+") {
                        this.hotKey = "Alt+" + key
                    } else {
                        this.hotKey = "Alt+" + key
                    }
                    this.correctHotKey = true
                }
                console.log(e.keyCode, vkeys.getKey(e.keyCode))
            },
            sendKey() {
                if (this.correctHotKey) {
                    ipcRenderer.send("writeOCRHotKey", this.hotKey);
                } else {
                    axios.get('../../../../config/ocrconfig.json').then(res => {
                        if (res.status === 200) {
                            this.hotKey = res.data.hotKey
                        }
                    })
                }
            },

            getConfig() {
                axios.get('../../../../config/ocrconfig.json').then(res => {
                    if (res.status === 200) {
                        this.hotKey = res.data.hotKey
                        this.ifDereplication = res.data.ifDereplication
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
                                    description: 'OCR返回结果过少，请检查游戏分辨率和打开的界面是否正确',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code == '216202') {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: '抓取不到图片，请检查游戏是否保持前台',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code == '18') {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: 'OCR申请过于频繁，请减慢点击速度',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code == '110') {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: 'Access Token设置错误',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code == '1000000') {
                                this.$notification['warning']({
                                    message: '已尝试抓取',
                                    description: '重复的圣遗物，取消写入',
                                    duration: 4.5,
                                });
                            } else if (res.data.error_code) {
                                this.$notification['error']({
                                    message: '抓取圣遗物失败',
                                    description: '未知错误，返回消息为' + JSON.stringify(res.data, null,
                                        4),
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


            handleIPC() {
                ipcRenderer.removeAllListeners('artifactsCatchFinished')
                ipcRenderer.removeAllListeners('expoetToClicpBoardFinished')
                ipcRenderer.removeAllListeners('artifactsResetFinished')
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

    #second-content-wrapper-om {
        background-color: rgb(250, 250, 250);
        height: 100%;
        overflow: auto;
    }

    #second-content-wrapper-om::-webkit-scrollbar {
        width: 8px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }



    #second-content-wrapper-om::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #ffababea;

    }

    #second-content-wrapper-om::-webkit-scrollbar-track {
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
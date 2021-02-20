<template>

    <div id="third-content">
        <span class="big-title">地图设置</span>

        <span class="title">地图源</span>

        <span class="note">选择你使用的地图</span>

        <!-- <div v-if="ifSelect"> -->
        <div>
            <a-select id="map-select" default-value="mihoyo" :value="mapName" style="width: 256px"
                @change="handleChange">
                <a-select-option value="mihoyo">
                    米游社
                </a-select-option>
                <a-select-option value="ghzs">
                    光环助手
                </a-select-option>
                <a-select-option value="userDefined">
                    自定义
                </a-select-option>
            </a-select>
        </div>

        <!-- <a-divider /> -->

        <div style="margin-bottom: 32px">
            <div v-show="ifDefine">
                <span class="note">输入你的指定的地图链接</span>

                <a-input addon-before="Https://" placeholder="请输入的地图链接" default-value="mysite" v-model="linkValue"
                    @change="saveLink" style="width: 100%" />

            </div>
        </div>

        <a-divider />

        <div id="hot-key">
            <span class="title">热键</span>
            <span class="note">独立地图热键</span>
            <div class="hot-key-switch">
                <a-switch @change="onHotKeySwitchChange" :checked="ifHotKeyButton" />
            </div>


            <span class="explain">通过设置的热键 显示 或 隐藏 独立的全屏地图</span>

            <transition name="slide-fade">
                <div v-show="ifHotKeyButton">

                    <span class="note">延迟隐藏窗口</span>
                    <div class="hot-key-switch">
                        <a-switch @change="onDelaySwitchChange" :checked="ifDelayButton" />
                    </div>
                    <span class="explain">切换回游戏时 延迟隐藏窗口可减少闪烁，建议开启</span>


                    <span class="note">自定义热键设置</span>
                    <a-button type="primary" @click="clickbutton" @keydown="writeKey" @blur="sendKey">
                        {{hotKey}}
                    </a-button>
                    <span class="explain" style="margin-top: 14px;">仅支持双键组合，游戏中建议Alt+任意键</span>

                </div>

            </transition>

        </div>

        <!-- <a-divider /> -->
    </div>
</template>

<script>
    const {
        ipcRenderer
    } = window.require("electron");

    import axios from 'axios'
    import vkeys from 'vkeys'

    let correctHotKey = true


    export default {
        data() {
            return {
                hotKey: "Alt+E",
                // ifSelect: false,
                ifDelayButton: true,
                ifHotKeyButton: false,
                // dataLink: "",
                mapName: "mihoyo",
                mihoyoLink: "webstatic.mihoyo.com/app/ys-map-cn/index.html?bbs_presentation_style=no_header&ts=1606133548270#/map/2?utm_source=bbs&utm_medium=mys&utm_campaign=slm&shown_types=&center=1675.00,-1190.00&zoom=-1.00",
                ghzsLink: "static-web.ghzs.com/cspage_pro/yuanshenMap.html#/",
                linkValue: "",
                ifDefine: false,
            }

        },
        mounted() {
            this.getConfig()
            // 正确的初始化方式

        },
        methods: {
            getConfig() {
                axios.get('../../../../config/mapconfig.json').then(res => {
                    if (res.status === 200) {
                        this.hotKey = res.data.hotKey
                        this.linkValue = res.data.link

                        // this.linkValue = this.dataLink
                        if (this.linkValue == this.mihoyoLink) {
                            this.mapName = "mihoyo"
                        } else if (this.linkValue == this.ghzsLink) {
                            this.mapName = "ghzs"
                        } else {
                            this.mapName = "userDefined"
                            this.ifDefine = true
                        }
                        // this.ifSelect = true
                        if (res.data.ifHotKey) {
                            // 热键按钮打开
                            this.ifHotKeyButton = true
                        } else {
                            this.ifHotKeyButton = false
                        }
                        if (res.data.ifDelay) {
                            // 延迟按钮打开
                            this.ifDelayButton = true
                        } else {
                            this.ifDelayButton = false
                        }
                    }
                })
            },
            handleChange(value) {
                this.mapName = value
                if (value == "userDefined") {
                    this.ifDefine = true;
                } else {
                    this.ifDefine = false;
                    if (value == "mihoyo") {
                        this.linkValue = this.mihoyoLink;
                    } else if (value == "ghzs") {
                        this.linkValue = this.ghzsLink;
                    }
                }
                this.saveLink()
                console.log('save!!')
                setTimeout(() => {
                    ipcRenderer.send("reloadMap")
                }, 300)
            },
            saveLink() {
                ipcRenderer.send("writeMapUrl", this.linkValue);
            },
            clickbutton() {
                // ipcRenderer.send("map");
                console.log("clicked", vkeys.getKey(60))
            },
            onHotKeySwitchChange(checked) {
                if (checked) {
                    this.ifHotKeyButton = true
                    ipcRenderer.send("createMap")
                } else {
                    this.ifHotKeyButton = false
                    ipcRenderer.send("destroyMap")
                }

            },
            onDelaySwitchChange(checked) {
                if (checked) {
                    this.ifDelayButton = true
                } else {
                    this.ifDelayButton = false
                }
                ipcRenderer.send("writeMapIfDelay", this.ifDelayButton);
            },
            writeKey(e) {
                correctHotKey = false
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
                    correctHotKey = true
                }
                console.log(e.keyCode, vkeys.getKey(e.keyCode))
            },
            sendKey() {
                if (correctHotKey) {
                    ipcRenderer.send("writeHotKey", this.hotKey);
                } else {
                    axios.get('../../../../config/mapconfig.json').then(res => {
                        if (res.status === 200) {
                            this.hotKey = res.data.hotKey
                        }
                    })
                }
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

    #third-content {
        padding: 50px;
        padding-top: 30px;
        color: #404040;
        font-size: 14px;
    }

    #map-select {
        margin-bottom: 7px;
    }

    .note {
        width: 100%;
        margin-bottom: 7px;
        display: inline-block;
    }

    .hot-key-switch {
        margin-bottom: 14px;
    }

    .explain {
        font-weight: 300;
        font-size: 13px;
        margin-bottom: 28px;
        display: block;
    }

    .slide-fade-enter-active {
        transition: all .2s ease;
    }

    .slide-fade-leave-active {
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        opacity: 0;
    }
</style>
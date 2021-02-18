<template>
    <div style="height: 100%;">
        <!-- <iframe id="map-view" src="https://static-web.ghzs.com/cspage_pro/yuanshenMap.html#/"></iframe> -->
        <!-- <webview id="map-view" :src="dataLink"></webview> -->
        <webview id="map-view" :src="dataLink"></webview>
    </div>
</template>

<script>
    import axios from 'axios'

    const {
        ipcRenderer
    } = window.require("electron");

    export default {
        data() {
            return {
                dataLink: "",
            }
        },
        mounted() {
            this.getLink()
            this.getConfig()
            this.handleIPC()
        },
        methods: {
            getLink() {
                axios.get('../../../../config/mapconfig.json').then(res => {
                    if (res.status === 200) {
                        this.dataLink = "https://" + res.data.link
                    }
                })
            },
            getConfig() {
                axios.get('../../../../config/config.json').then(res => {
                    if (res.status === 200) {
                        if (res.data.ifAutoCookieButton) {
                            ipcRenderer.send("getCookie");
                        }
                    }
                })
            },
            handleIPC() {
                ipcRenderer.removeAllListeners('getCookieFinished')
                ipcRenderer.once('getCookieFinished', () => {
                    axios.get('../../../../data/cookie.json').then(res => {
                        if (res.status === 200) {
                            if (res.data.cookie.length < 128) {
                                this.$notification['error']({
                                    message: 'Cookie异常',
                                    description: '请检查是否登录或网络连接通畅，本次获取Cookie为：' + res.data.cookie,
                                    // description: '请检查是否登录或网络连接通畅，本次获取Cookie为：' + cookie,
                                    duration: 4.5,
                                });
                            } else {
                                this.$notification['success']({
                                    message: '读取Cookie成功',
                                    description: 'Cookie长期有效，可在设置中查看并关闭自动读取功能',
                                    duration: 4.5,
                                });
                            }
                        }
                    })
                })
            },
        }
    };
</script>

<style>
    #map-view {
        width: 100%;
        height: 100%;
        background-color: rgb(192, 192, 192);
        outline: none;
        border: 0;
    }
</style>
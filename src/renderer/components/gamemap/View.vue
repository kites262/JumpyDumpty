<template>
    <div style="height: 100%;">

        <!-- <a-button type="primary" @click="getLink()">
            Alt+E
        </a-button> -->

        <!-- <iframe id="map-view" src="https://static-web.ghzs.com/cspage_pro/yuanshenMap.html#/"></iframe> -->
        <!-- <webview id="map-view" :src="dataLink"></webview> -->
        <webview id="map-view" :src="dataLink"></webview>
        <!-- <iframe id="map-view" :src="dataLink"></iframe> -->
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
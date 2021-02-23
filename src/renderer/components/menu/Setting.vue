<template>
    <div id="second-content-wrapper">
        <myTitle></myTitle>
        <div id="container">

            <span class="big-title">设置</span>
            <span class="title">Cookie</span>
            <span class="note">设置你的Cookie</span>


            <div style="margin-bottom: 5px">
                <div id="cookie-input">
                    <a-input default-value="请输入你的Cookie" v-model="cookieValue" placeholder="请输入你的Cookie"  @change="saveCookie"
                        style="width: 100%" />
                </div>
            </div>
            <span class="explain">Cookie获取方法可参考：https://github.com/yinghualuowu/GenshinDailyHelper</span>

            <span class="note">自动抓取Cookie</span>
            <div class="hot-key-switch">
                <a-switch @change="onAutoCookieSwitchChange" :checked="ifAutoCookieButton" />
            </div>
            <span class="explain">登录或刷新米游社观测枢大地图(地图预览功能)时自动抓取Cookie</span>

            <a-divider />

            <span class="title">关于</span>
            <span class="note">本程序开源且免费，项目地址：https://github.com/ChanIok/JumpyDumpty</span>
            <span class="note">问题可直接在GitHub或NGA反馈：https://bbs.nga.cn/read.php?tid=25647353&page=4#pid495479398Anchor</span>
            <span class="explain">如果觉得有用，可以给个star，谢谢你</span>
            
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
                cookieValue: '',
                ifAutoCookieButton: false,
            }
        },
        mounted() {
            this.getConfig()
            this.readCookie()
        },
        components: {
            myTitle
        },
        methods: {
            readCookie() {
                axios.get('../../../../data/cookie.json').then(res => {
                    if (res.status === 200) {
                        this.cookieValue = res.data.cookie
                    }
                })
            },
            getConfig() {
                axios.get('../../../../config/config.json').then(res => {
                    if (res.status === 200) {
                        if (res.data.ifAutoCookieButton) {
                            // 按钮打开
                            this.ifAutoCookieButton = true
                        } else {
                            this.ifAutoCookieButton = false
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

    #cookie-input {
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
        padding: 40px;
    }
</style>
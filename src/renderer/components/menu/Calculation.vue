<template>
    <div style="height: 100%;">
        <myTitle></myTitle>
        <!-- <iframe id="map-view" src="https://static-web.ghzs.com/cspage_pro/yuanshenMap.html#/"></iframe> -->
        <!-- <webview id="map-view" :src="dataLink"></webview> -->
        <webview id="cal-view" ref="calView" :src="dataLink"></webview>
    </div>
</template>

<script>
    import myTitle from '../coms/Title.vue'
    export default {
        data() {
            return {
                dataLink: 'http://www.genshin.art/'
            }
        },
        mounted() {
            this.changeSider()
        },
        components: {
            myTitle
        },
        methods: {
            changeSider() {
                let calView = document.querySelector('webview')
                calView.addEventListener("did-stop-loading", () => {
                    calView.insertCSS(`
                    
    .el-aside {
        min-width: 200px;
        width: 15% !important;
        max-width: 300px;
    }
                                    `)
                    console.log("did-stop-loading...");

                })
            }
        }
    }
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
        background-color: #fff;
    }

    .my-sider {
        width: 20%;
        max-width: 300px;
        min-width: 200px;
    }

    #cal-view {
        width: 100%;
        height: calc(100% - 35px);
        background-color: rgb(255, 255, 255);
        outline: none;
        border: 0;
    }

</style>
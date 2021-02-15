<template>
    <div style="height: 100%;">
        <a-layout id="second-content">


            <a-layout-sider id="second-sider" :trigger="null" collapsible
                style="max-width: 256px; width: 256px;flex:0 0 256px">

                <div id="search-wrapper">
                    <a-input-search id="id-search" placeholder="请输入ID" enter-button @search="getInfo" />
                </div>

                <a-menu mode="inline" :default-selected-keys="['1']" :default-open-keys="['sub1']">

                    <a-menu-item key="1" @click="()=>{
                        this.$router.push('/infoquery/overview')
                    }">
                        <a-icon type="setting" />
                        数据总览
                    </a-menu-item>
                    
                    <a-sub-menu key="sub1">
                        <span slot="title">
                            <a-icon type="team" /><span> TA的角色</span></span>
                        <a-menu-item v-for="(role,i) in characters">

                            <a-avatar class="char-img" :src="role.image"
                                :style="role.rarity==4?'background-color: #876ab1;':'background-color: #ca884e;'" />
                            <div class="char-name"> {{role.name}}</div>

                            <div class="char-level"> Lv.{{role.level}}</div>
                        </a-menu-item>

                    </a-sub-menu>
                    <!-- <a-menu-item key="2" @click="()=>{
                  
                    }">
                        <a-icon type="interaction" />
                        TA的角色
                    </a-menu-item> -->
                    <a-menu-item key="3" @click="()=>{
                     
                    }">
                        <a-icon type="info-circle" />
                        深渊战绩
                    </a-menu-item>


                </a-menu>
            </a-layout-sider>
            <a-layout id="third-content">
                <my-title id="my-title"></my-title>
                <a-layout-content :style="{ margin: '0', padding: '0', background: '#fff', minHeight: '280px' }">
                    <router-view>Content</router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    // const {
    //     ipcRenderer
    // } = window.require("electron");
    import myTitle from './coms/Title.vue'
    export default {
        data() {
            return {
                characters: [{
                        "id": 10000023,
                        "image": "https://upload-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xiangling.png",
                        "name": "香菱",
                        "element": "Pyro",
                        "fetter": 6,
                        "level": 80,
                        "rarity": 4
                    },
                    {
                        "id": 10000034,
                        "image": "https://upload-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Noel.png",
                        "name": "诺艾尔",
                        "element": "Geo",
                        "fetter": 6,
                        "level": 80,
                        "rarity": 4
                    }, {
                        "id": 10000022,
                        "image": "https://upload-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Venti.png",
                        "name": "温迪",
                        "element": "Anemo",
                        "fetter": 1,
                        "level": 40,
                        "rarity": 5
                    },
                ]
            }
        },
        components: {
            myTitle
        },
        methods: {
            getInfo(value) {
                ipcRenderer.send("getInfo", value)
            }

        }
    };
</script>

<style scoped>
    #search-wrapper {
        width: 256px;
        height: 72px;
        box-sizing: border-box;
        padding-top: 32px;
        padding-left: 10px;
        background-color: rgb(250, 250, 250);
    }

    #id-search {
        height: 40px;
    }

    .char-img {
        float: left;
        
    }

    .char-name {
        font-weight: 500;
        width: 80px;
        height: 40px;
        float: left;
        margin-left: 15px;
    }

    .char-level {
        font-weight: 500;
        text-align: center;
        width: 60px;
        height: 40px;
        float: right;
    }

    #my-title {
        background-color: rgb(250, 250, 250);
    }

    #second-content {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    #second-sider {
        height: 100%;

        background-color: #ffffff;
    }

    #third-content {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: rgb(250, 250, 250);
    }
</style>
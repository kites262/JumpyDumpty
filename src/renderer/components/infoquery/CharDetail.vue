<template>
    <div id="third-content-dt"  v-if="ifReadFinished">
        <div id="constellations-list-wrapper">

            <div class="constellations-list-item" v-for="(item,i) in character.constellations" :key="i">

                <a-popover :title="item.name" placement="right">
                    <template slot="content">
                        <div style="max-width: 400px;">
                            {{item.effect}}
                        </div>

                    </template>


                    <div class="constellations-list-item-img">
                        <a-avatar shape="circle" :size="52" :src="item.icon"
                            style="background-color: inherit;position: absolute;" />
                        <a-avatar shape="circle" :size="52" icon="lock" v-if="!item.is_actived"
                            style="background-color: inherit;position: absolute;opacity: 0.8;" />
                    </div>
                    <!-- <div class="constellations-list-item">
        {{item.name}}
        </div> -->
                </a-popover>
            </div>

        </div>


        <div id="char-img-bg" :style="{backgroundImage: 'url(' + character.image + ')'}">
            <!-- Electro -->
        </div>
        <div id="char-img-element" :style="{backgroundImage: 'url(' + charImg[this.character.element] + ')'}">

        </div>
        <div id="char-wrapper">
            <a-card id="char-card" hoverable>

                <img id="char-card-icon" slot="cover" alt="example" :src="character.icon" />
                <div id="char-card-container" style="position: relative;">
                    <div id="char-card-title">
                        {{character.name}}
                    </div>

                    <a-icon type="star" theme="twoTone" two-tone-color="orange" v-for="(item,i) in character.rarity"
                        :key="i" />
                    <div id="char-card-right">
                        <div id="char-card-element">
                            {{this.charELement}}
                        </div>
                        <div id="char-card-fetter">
                            好感度：{{character.fetter}}
                        </div>
                        <div id="char-card-level">
                            等级：<span style="font-size: 16px;font-weight: 500;">
                                Lv.{{character.level}}
                            </span>


                        </div>

                    </div>

                </div>

            </a-card>

            <div id="list-wrapper">


                <div class="list-item-wrapper">
                    <span class="big-title">装备详情</span>

                    <span class="title">武器</span>
                    <a-popover title="武器描述" placement="left">
                        <template slot="content">
                            <div class="grid-container-wrapper" style="max-width: 400px;">
                                <div class="grid-container">
                                    {{character.weapon.desc}}
                                </div>
                            </div>
                        </template>

                        <div class="list-item">
                            <div class="list-header-wrapper">

                                <div class="list-img">
                                    <a-avatar shape="square" :size="64" :src="character.weapon.icon"
                                        style="background-color: rgb(248, 248, 248);align-self: center;" />
                                </div>
                                <div class="list-header">
                                    <div class="list-header-name">
                                        {{character.weapon.name}}
                                    </div>
                                    <div class="list-header-stars">
                                        <a-icon type="star" theme="twoTone" two-tone-color="#FF8000"
                                            v-for="(item,i) in character.weapon.rarity" :key="i" />
                                    </div>
                                    <div class="list-header-right">
                                        <div class="list-header-explain" style="display: inline-block;">
                                            精炼{{character.weapon.affix_level}}阶
                                        </div>
                                        <div class="list-header-level"
                                            style="display: inline-block;margin-left: 15px; ">
                                            Lv.{{character.weapon.level}}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="list-container">

                            </div>
                        </div>
                    </a-popover>

                    <a-divider />

                </div>







                <div class="list-item-wrapper" v-for="(item,i) in character.reliquaries" :key="i">


                    <span class="title">{{item.pos_name}}</span>
                    <a-popover :title="item.set.name" placement="left">
                        <template slot="content">
                            <div class="grid-container-wrapper">
                                <div class="grid-container" style="max-width: 400px;">
                                    <div v-for="(it,i) in item.set.affixes" :key="i">
                                        {{it.activation_number}}件套：
                                        {{it.effect}}
                                    </div>
                                </div>
                            </div>
                        </template>

                        <div class="list-item">
                            <div class="list-header-wrapper">

                                <div class="list-img">
                                    <a-avatar shape="square" :size="64" :src="item.icon"
                                        style="background-color: rgb(248, 248, 248);align-self: center;" />
                                </div>
                                <div class="list-header">
                                    <div class="list-header-name">
                                        {{item.name}}
                                    </div>
                                    <div class="list-header-stars">
                                        <a-icon type="star" theme="twoTone" two-tone-color="#FF8000"
                                            v-for="(item,i) in item.rarity" :key="i" />
                                    </div>
                                    <div class="list-header-right">
                                        <div class="list-header-level" style="display: inline-block; ">
                                            Lv.{{item.level}}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="list-container">

                            </div>
                        </div>
                    </a-popover>

                    <a-divider />

                </div>

            </div>


        </div>

    </div>
</template>
<style scoped>
    .big-title {
        height: 35px;
        font-size: 28px;
        font-weight: 500;
        margin-bottom: 28px;
        display: block;
        overflow: hidden;
    }

    .title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
        display: inline-block;
    }

    .explain {
        font-weight: 300;
        font-size: 13px;
        margin-bottom: 28px;
        display: block;
    }

    #third-content-dt {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgb(250, 250, 250);
        /* z-index: -1; */
    }

    #constellations-list-wrapper {

        position: absolute;
        box-sizing: border-box;
        padding: 10px;
        z-index: 1;
        height: 100%;
        background-color: rgba(245, 245, 245, 0.5);
        overflow: hidden;
    }

    .constellations-list-item-img {
        width: 52px;
        height: 52px;
        background-color: rgb(150, 150, 150);
        cursor: pointer;
        position: relative;
    }

    .constellations-list-item-img:hover {
        background-color: rgb(224, 101, 101);
    }

    .constellations-list-item {
        margin-bottom: 20px;
        width: 100%;
    }

    #char-img-bg {
        width: 100%;
        height: 100%;
        background-position: calc(45% + 50px) top;
        background-size: contain;
        position: absolute;
        right: 0px;
        bottom: 0px;
        background-repeat: no-repeat;
        /* z-index: 2; */
        opacity: 0.3;
    }

    #char-img-element {
        width: 40%;
        height: 45%;
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        bottom: 10px;
        left: 80px;
    }

    #char-wrapper {
        width: 100%;
        height: 100%;
    }

    #char-card-icon {
        background-color: rgba(228, 228, 228, 0.363);
    }

    #char-card {
        position: absolute;
        width: 20%;
        min-width: 220px;
        max-width: 300px;
        /* height: 30%; */
        left: 12%;
        top: 5%;
        z-index: 2;
    }

    #char-card-title {
        margin-bottom: 15px;
    }

    #char-card-element {
        font-size: 16px;
        margin-bottom: 3px;
    }

    #char-card-right {
        position: absolute;
        right: 0px;
        top: 0px;
        text-align: right;
    }

    #char-card-title {
        font-size: 24px;
        font-weight: 500;
    }

    #list-wrapper {
        width: 60%;
        max-width: 450px;
        min-width: 300px;
        height: 100%;
        position: absolute;
        right: 0px;
        background-color: rgba(255, 255, 255, 0.9);
        /* display: flex; */
        padding: 20px;
        padding-left: 40px;
        padding-right: 40px;
        /* flex-direction: column; */
        overflow: auto;
    }

    #list-wrapper::-webkit-scrollbar {
        width: 8px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }



    #list-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #ffababea;

    }

    #list-wrapper::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;

    }

    .list-item {
        cursor: pointer;
        height: 64px;
    }


    .list-item:hover {
        color: #f08c8c;
        background-color: rgba(255, 225, 225, 0.05);
    }



    .list-header-wrapper {
        display: flex;
        overflow: hidden;
        position: relative;
        max-height: 65px;

    }

    .list-header {
        margin-left: 20px;
    }

    .list-header-right {
        width: 180px;
        height: 24px;
        position: absolute;
        right: 10%;
        top: 40px;
        text-align: right;
    }




    .list-header-name {
        font-size: 16px;

    }

    .list-header-level {
        font-size: 18px;
        font-weight: 500;
    }

    .list-header-explain {
        font-size: 14px;
    }

    .list-header-stars {
        margin-top: 20px;
    }






</style>

<script>
    import axios from 'axios'

    export default {
        // props:['charid'],
        data() {
            return {
                ifReadFinished:false,
                charID: this.$route.params.id,
                charELement: '',
                charImg: {
                    None: "",
                    Anemo: "https://uploadstatic.mihoyo.com/contentweb/20190926/2019092620142687125.png",
                    Pyro: "https://uploadstatic.mihoyo.com/contentweb/20190926/2019092620153999417.png",
                    Electro: 'https://uploadstatic.mihoyo.com/contentweb/20190926/2019092620184031492.png',
                    Geo: "https://uploadstatic.mihoyo.com/contentweb/20201216/2020121617553582444.png",
                    Cryo: "https://uploadstatic.mihoyo.com/contentweb/20201106/2020110614341398595.png",
                    Hydro: "https://uploadstatic.mihoyo.com/contentweb/20200324/2020032419033772019.png",
                    Dendro: "",
                },
                character: {},
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                axios.get('../../../../data/charactersInfo.json').then(res => {
                    if (res.status === 200) {
                        for (let item of res.data.data.avatars) {
                            if (item.id == this.charID) {
                                this.character = item
                                this.ifReadFinished =true
                                this.handleData()
                                break
                            }
                        }
                    }
                })
            },
            handleData() {
        
                    if (this.character.element == "None") {
                        this.charELement = "无属性"
                    } else if (this.character.element == "Anemo") {
                        this.charELement = "风"
                    } else if (this.character.element == "Pyro") {
                        this.charELement = "火"
                    } else if (this.character.element == "Geo") {
                        this.charELement = "岩"
                    } else if (this.character.element == "Electro") {
                        this.charELement= "雷"
                    } else if (this.character.element == "Cryo") {
                        this.charELement = "冰"
                    } else if (this.character.element == "Hydro") {
                        this.charELement= "水"
                    } else {
                        this.charELement= "草"
                    }
                
            },
        }


    };
</script>
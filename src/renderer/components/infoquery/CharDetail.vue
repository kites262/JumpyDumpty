<template>
    <div id="third-content-dt">
        <div id="char-img-bg" :style="{backgroundImage: 'url(' + charImg.bg + ')'}">

        </div>
        <div id="char-img-element" :style="{backgroundImage: 'url(' + charImg.element + ')'}">

        </div>
        <div id="char-wrapper">
            <a-card id="char-card" hoverable>

                <img id="char-card-icon" slot="cover" alt="example" :src="character.icon" />



                <a-card-meta :title="character.name" description="">
                </a-card-meta>
                <a-icon type="star" theme="twoTone" two-tone-color="#FF8000" v-for="(item,i) in character.rarity"
                    key="i" />
                <p>222</p>
            </a-card>


            <div id="grid-cards-wrapper" style="background-color: #ececec; padding: 20px;">
                <a-row :gutter="[16,16]" :type="flex">
                    <a-col :span="8">

                        <a-popover title="武器描述">
                            <template slot="content">
                                <div class="grid-container-wrapper">
                                    <div class="grid-container">
                                        {{character.weapon.desc}}
                                    </div>
                                </div>
                            </template>

                            <a-card title="武器" :bordered="false" hoverable type="primary">
                                <div class="grid-cards-header-wrapper">
                                    <div class="grid-icon">
                                        <a-avatar shape="square" :size="64" :src="character.weapon.icon"
                                            style="background-color: rgb(248, 248, 248);align-self: center;" />
                                    </div>
                                    <div class="grid-cards-header">
                                        <div class="grid-title-name">
                                            {{character.weapon.name}}
                                        </div>
                                        <div class="grid-title-level" style="display: inline-block;margin-right: 5px;">
                                            Lv.{{character.weapon.level}}
                                        </div>
                                        <div class="grid-title-explain" style="display: inline-block;">
                                            精炼{{character.weapon.affix_level}}阶
                                        </div>
                                        <div class="grid-title-stars">
                                            <a-icon type="star" theme="twoTone" two-tone-color="#FF8000"
                                                v-for="(item,i) in character.weapon.rarity" key="i" />
                                        </div>
                                    </div>
                                </div>

                            </a-card>
                        </a-popover>


                    </a-col>

                    <a-col :span="8" v-for="(item,i) in character.reliquaries" key="i">
                        <a-popover :title="item.set.name" placement="topLeft" arrow-point-at-center>
                            <template slot="content">
                                <div class="grid-container-wrapper">
                                    <div class="grid-container">
                                        <div v-for="(it,i) in item.set.affixes" key="i">
                                             {{it.activation_number}}件套：
                                             {{it.effect}}
                                        </div>
                                    </div>
                                </div>
                            </template>

                        <a-card :title="item.pos_name" :bordered="false" hoverable>
                            <div class="grid-cards-header-wrapper">
                                <div class="grid-icon">
                                    <a-avatar shape="square" :size="64" :src="item.icon"
                                        style="background-color: rgb(248, 248, 248);align-self: center;" />
                                </div>
                                <div class="grid-cards-header">
                                    <div class="grid-title-name">
                                        {{item.name}}
                                    </div>
                                    <div class="grid-title-level" style="display: inline-block;margin-right: 5px;">
                                        Lv.{{item.level}}
                                    </div>

                                    <div class="grid-title-stars">
                                        <a-icon type="star" theme="twoTone" two-tone-color="#FF8000"
                                            v-for="(star,i) in item.rarity" key="i" />
                                    </div>

                                </div>

                            </div>
        
                             </a-card>
                        </a-popover>

                    </a-col>

                </a-row>
            </div>


        </div>

    </div>
</template>
<style scoped>
    #third-content-dt {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgb(250, 250, 250);
        /* z-index: -1; */
    }

    #char-img-bg {
        width: 100%;
        height: 100%;
        background-position: 60% top;
        background-size: cover;
        position: absolute;
        right: 0px;
        bottom: 0px;
        background-repeat: no-repeat;
        /* z-index: -1; */
        opacity: 0.3;
    }

    #char-img-element {
        width: 40%;
        height: 45%;
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute
    }

    #char-wrapper {
        width: 100%;
        height: 100%;
    }

    #char-card-icon {
        background-color: rgba(228, 228, 228, 0.363);
    }

    #char-card {
        position: relative;
        width: 20%;
        min-width: 200px;
        max-width: 280px;
        /* height: 30%; */
        left: 10%;
        top: 5%;
    }

    #grid-cards-wrapper {
        position: absolute;
        bottom: 5%;
        left: 10%;
        /* display: flex; */

    }

    .grid-cards-header-wrapper {
        display: flex;
        overflow: hidden;

    }

    .grid-cards-header {
        margin-left: 10px;
        min-width: 64px;
    }

    .grid-title-name {
        font-size: 16px;

    }

    .grid-title-level {
        font-size: 14px;
        font-weight: 500;
    }

    .grid-title-explain {
        font-size: 12px;
    }

    .grid-icon {
        display: flex;
    }


</style>

<script>
    import axios from 'axios'

    export default {
        // props:['charid'],
        mounted() {
            // this.getData()
            // 正确的初始化方式
        },
        methods: {
            getData() {

            },
            setData() {

            }
        },
        data() {
            return {
                charImg: {
                    bg: 'https://uploadstatic.mihoyo.com/contentweb/20200315/2020031516372312969.png',
                    element: 'https://uploadstatic.mihoyo.com/contentweb/20200315/2020031516374761741.png',
                },
                character: {
                    "id": 10000023,
                    "image": "https://upload-bbs.mihoyo.com/game_record/genshin/character_image/UI_AvatarIcon_Xiangling@2x.png",
                    "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xiangling.png",
                    "name": "香菱",
                    "element": "Pyro",
                    "fetter": 6,
                    "level": 80,
                    "rarity": 4,
                    "weapon": {
                        "id": 13402,
                        "name": "试作星镰",
                        "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Proto.png",
                        "type": 13,
                        "rarity": 4,
                        "level": 80,
                        "promote_level": 5,
                        "type_name": "长柄武器",
                        "desc": "黑岩厂中秘藏的古老钩枪。锋芒上点点的闪光有如夜空稀星。",
                        "affix_level": 2
                    },
                    "reliquaries": [{
                            "id": 89442,
                            "name": "夏祭之花",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/equip/UI_RelicIcon_15015_4.png",
                            "pos": 1,
                            "rarity": 4,
                            "level": 12,
                            "set": {
                                "id": 2150151,
                                "name": "逆飞的流星",
                                "affixes": [{
                                        "activation_number": 2,
                                        "effect": "护盾强效提高35%。"
                                    },
                                    {
                                        "activation_number": 4,
                                        "effect": "处于护盾庇护下时，额外获得40%普通攻击和重击伤害加成。"
                                    }
                                ]
                            },
                            "pos_name": "生之花"
                        },
                        {
                            "id": 59422,
                            "name": "流放者之羽",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/equip/UI_RelicIcon_10009_2.png",
                            "pos": 2,
                            "rarity": 4,
                            "level": 12,
                            "set": {
                                "id": 2100091,
                                "name": "流放者",
                                "affixes": [{
                                        "activation_number": 2,
                                        "effect": "元素充能效率提高20%。"
                                    },
                                    {
                                        "activation_number": 4,
                                        "effect": "施放元素爆发后，每2秒为队伍中所有角色（不包括自己）恢复2点元素能量。该效果持续6秒，无法叠加。"
                                    }
                                ]
                            },
                            "pos_name": "死之羽"
                        },
                        {
                            "id": 57453,
                            "name": "教官的怀表",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/equip/UI_RelicIcon_10007_5.png",
                            "pos": 3,
                            "rarity": 4,
                            "level": 9,
                            "set": {
                                "id": 2100071,
                                "name": "教官",
                                "affixes": [{
                                        "activation_number": 2,
                                        "effect": "元素精通提高80点。"
                                    },
                                    {
                                        "activation_number": 4,
                                        "effect": "触发元素反应后，队伍中所有角色的元素精通提高120点，持续8秒。"
                                    }
                                ]
                            },
                            "pos_name": "时之沙"
                        },
                        {
                            "id": 82413,
                            "name": "染血骑士之杯",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/equip/UI_RelicIcon_15008_1.png",
                            "pos": 4,
                            "rarity": 4,
                            "level": 3,
                            "set": {
                                "id": 2150081,
                                "name": "染血的骑士道",
                                "affixes": [{
                                        "activation_number": 2,
                                        "effect": "造成的物理伤害提高25%。"
                                    },
                                    {
                                        "activation_number": 4,
                                        "effect": "击败敌人后的10秒内，施放重击时不消耗体力，且重击造成的伤害提升50%。"
                                    }
                                ]
                            },
                            "pos_name": "空之杯"
                        },
                        {
                            "id": 83432,
                            "name": "祭火礼冠",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/equip/UI_RelicIcon_15009_3.png",
                            "pos": 5,
                            "rarity": 4,
                            "level": 16,
                            "set": {
                                "id": 2150090,
                                "name": "祭火之人",
                                "affixes": [{
                                    "activation_number": 1,
                                    "effect": "受到的火元素附着效果的持续时间减少40%。"
                                }]
                            },
                            "pos_name": "理之冠"
                        }
                    ],
                    "constellations": [{
                            "id": 231,
                            "name": "外酥里嫩",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/UI_Talent_S_Xiangling_01.png",
                            "effect": "受到锅巴攻击的敌人，<color=#FF9999FF>火元素抗性</color>降低15%，持续6秒。",
                            "is_actived": true,
                            "pos": 1
                        },
                        {
                            "id": 232,
                            "name": "大火宽油",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/UI_Talent_S_Xiangling_02.png",
                            "effect": "普通攻击的最后一击会对敌人施加持续2秒的内爆效果，持续时间结束时会发生爆炸，造成75%攻击力的<color=#FF9999FF>火元素范围伤害</color>。",
                            "is_actived": true,
                            "pos": 2
                        },
                        {
                            "id": 233,
                            "name": "武火急烹",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/UI_Talent_U_Xiangling_02.png",
                            "effect": "<color=#FFD780FF>旋火轮</color>的技能等级提高3级。\\n至多提升至15级。",
                            "is_actived": true,
                            "pos": 3
                        },
                        {
                            "id": 234,
                            "name": "文火慢煨",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/UI_Talent_S_Xiangling_03.png",
                            "effect": "<color=#FFD780FF>旋火轮</color>的持续时间延长40%。",
                            "is_actived": true,
                            "pos": 4
                        },
                        {
                            "id": 235,
                            "name": "锅巴凶猛",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/UI_Talent_U_Xiangling_01.png",
                            "effect": "<color=#FFD780FF>锅巴出击</color>的技能等级提高3级。\\n至多提升至15级。",
                            "is_actived": false,
                            "pos": 5
                        },
                        {
                            "id": 236,
                            "name": "大龙卷旋火轮",
                            "icon": "https://upload-bbs.mihoyo.com/game_record/genshin/constellation_icon/UI_Talent_S_Xiangling_04.png",
                            "effect": "<color=#FFD780FF>旋火轮</color>持续期间，队伍中所有角色获得15%<color=#FF9999FF>火元素伤害加成</color>。",
                            "is_actived": false,
                            "pos": 6
                        }
                    ]
                },
                dataLink: "",
            }
        },
        mounted() {
            // this.getLink()
        },
        methods: {
            // getLink() {
            //     axios.get('../../../../config/mapconfig.json').then(res => {
            //         if (res.status === 200) {
            //             this.dataLink = "https://" + res.data.link
            //         }
            //     })
            // },
        }


    };
</script>
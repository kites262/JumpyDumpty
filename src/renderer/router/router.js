import Vue from 'vue'
import VueRouter from 'vue-router'

import LayOut from '../components/LayOut.vue'

import MapSet from '../components/menu/GameMap.vue'
import DamageCal from '../components/menu/DamageCal.vue'
import RoleIndex from '../components/menu/RoleIndex.vue'
import InfoQuery from '../components/menu/InfoQuery.vue'
import ArtifactsExport from '../components/menu/ArtifactsExport.vue'
import Setting from '../components/menu/Setting.vue'

import View from '../components/gamemap/View.vue'
import MapSetting from '../components/gamemap/Setting.vue'
import Instructions from '../components/gamemap/Instructions.vue'

import Overview from '../components/infoquery/Overview.vue'
import CharDetail from '../components/infoquery/CharDetail.vue'
import SpiralAbyss from '../components/infoquery/SpiralAbyss.vue'
import CombatReview from '../components/infoquery/spiralabyss/CombatReview.vue'
import DataRanking from '../components/infoquery/spiralabyss/DataRanking.vue'
import FloorDetail from '../components/infoquery/spiralabyss/FloorDetail.vue'

import OCRMain from '../components/artifactsexport/OCRMain.vue'
import OCRSetting from '../components/artifactsexport/OCRSetting.vue'

// 注册路由
Vue.use(VueRouter)


//定义routes路由的集合，数组类型
const routes = [
    //单个路由均为对象类型，path代表的是路径，component代表组件

    {

        path: '/',
        name: 'layout',
        component: LayOut,
        redirect: 'gamemap',
        children: [{
                path: 'roleindex',
                component: RoleIndex
            },


            {
                path: 'damagecal',
                component: DamageCal
            },
            {
                path: 'gamemap',
                component: MapSet,
                redirect: 'gamemap/setting',
                children: [{
                    path: 'view',
                    component: View
                }, {
                    path: 'setting',
                    component: MapSetting
                }, {
                    path: 'instructions',
                    component: Instructions
                }]
            },
            {
                path: 'infoquery',
                component: InfoQuery,
                redirect: 'infoquery/overview',
                children: [{
                    path: 'overview',
                    component: Overview
                }, {
                    path: 'chardetail/:id',
                    component: CharDetail,

                }, {
                    path: 'spiralabyss',
                    component: SpiralAbyss,
                    redirect: 'spiralabyss/combatreview',
                    children: [{
                        path: 'combatreview',
                        component: CombatReview
                    }, {
                        path: 'dataranking/:value',
                        // path: 'chardetail',
                        component: DataRanking,
                        // props: true,
                    }, {
                        path: 'floordetail/:value',
                        // path: 'chardetail',
                        component: FloorDetail,
                        // props: true,
                    }]
                }]
            },

            {
                path: 'setting',
                component: Setting,
            }, {
                path: 'artifactsexport',
                component: ArtifactsExport,
                redirect: 'artifactsexport/ocrsetting',
                children: [{
                    path: 'ocrsetting',
                    component: OCRSetting
                }, {
                    path: 'ocrmain',
                    component: OCRMain
                }]
            },
        ]
    },




]

//实例化VueRouter并将routes添加进去
const router = new VueRouter({
    //ES6简写，等于routes：routes
    routes
});


//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//抛出这个这个实例对象方便外部读取以及访问
export default router
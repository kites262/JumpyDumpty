import Vue from 'vue'
import VueRouter from 'vue-router'

import LayOut from '../components/LayOut.vue'
import MapSet from '../components/GameMap.vue'

import DamageCal from '../components/DamageCal.vue'
import RoleIndex from '../components/RoleIndex.vue'
import InfoQuery from '../components/InfoQuery.vue'

import View from '../components/gamemap/View.vue'
import Setting from '../components/gamemap/Setting.vue'
import Instructions from '../components/gamemap/Instructions.vue'

import Overview from '../components/infoquery/Overview.vue'
import CharDetail from '../components/infoquery/CharDetail.vue'

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
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'roleindex',
                component: RoleIndex
            },


            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'damagecal',
                component: DamageCal
            },
            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'gamemap',
                component: MapSet,
                redirect: 'gamemap/setting',
                children: [{
                    path: 'view',
                    component: View
                }, {
                    path: 'setting',
                    component: Setting
                }, {
                    path: 'instructions',
                    component: Instructions
                }]
            },
            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'infoquery',
                component: InfoQuery,
                redirect: 'infoquery/chardetail',
                children: [{
                    path: 'overview',
                    component: Overview
                }, {
                    // path: 'chardetail/:id',
                    path: 'chardetail',
                    component: CharDetail,
                    // props: true,
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
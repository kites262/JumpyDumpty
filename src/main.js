
import Vue from 'vue'
 
import Antd from 'ant-design-vue'// 引入Ant Design Vue组件
import 'ant-design-vue/dist/antd.less' // 引入Ant Design Vue样式

import App from './renderer/App.vue'
// 导入App组件

import router from './renderer/router/router.js'
// 导入路由

Vue.use(Antd) //挂载到vue中


// 创建Vue根实例
new Vue({
    el:'#app',
    router:router,
    components:{
        // 组件名：组件对象
        App
    },
    template:'<App/>'
})

// 挂载App组件
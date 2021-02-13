<template>
    <div style="height: 100%;">

        <a-layout id="second-content">
            <a-layout-sider id="second-sider" :trigger="null" collapsible
                style="max-width: 200px; width: 200px;flex:0 0 200px">
                <a-menu mode="inline" :default-selected-keys="['1']">

                    <a-menu-item key="1" @click="()=>{
                        this.$router.push('/gamemap/setting')
                    }">
                        <a-icon type="setting" />
                        地图设置
                    </a-menu-item>
                    <a-menu-item key="2" @click="()=>{
                        this.$router.push('/gamemap/view')
                    }">
                        <a-icon type="interaction" />
                        地图预览
                    </a-menu-item>
                    <a-menu-item key="3" @click="()=>{
                        this.$router.push('/gamemap/instructions')
                    }">
                        <a-icon type="info-circle" />
                        功能说明
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
    import myTitle from './coms/Title.vue'
    export default {
        data() {
            return {

            };
        },
        components: {
            myTitle
        },
    };
</script>

<style scoped>
    #my-title{
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
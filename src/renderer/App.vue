<template>
    <div>
        <router-link to="/"></router-link>
        <router-view></router-view>
    </div>
</template>

<script>
    import LayOut from './components/LayOut.vue'
    export default {
        name: 'App',
        components: {
            'lay-out':LayOut
        }
    }
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
}
body>div:first-child,body>div:first-child>div{
    height: 100%;
}
</style>
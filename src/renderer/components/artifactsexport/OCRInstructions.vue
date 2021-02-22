<template>
    <div id="third-content">
        <span class="big-title">介绍</span>
        <div class="title">
            使用方法：
        </div>
        <span class="note">
            运行程序，先输入你的 ApiKey 和 SecretKey，点击获取 AccessToken
        </span>

        <span class="note">
            进去抓取页面，可手动点击按钮抓取
        </span>
        <span class="note">
            默认注册热键为 Alt+R，<span style="font-weight: 600;">按下该热键后，开启快速抓取模式</span> ，程序自动捕捉鼠标点击事件来抓取游戏屏幕并 OCR
            识别（此时只需要逐个点击背包的圣遗物即可）
        </span>

        <a-divider />

        <div class="title">
            运行条件：
        </div>

        <span class="note">
            管理员权限(无权限只能手动抓取)
        </span>
        <span class="note">
            游戏不能最小化，独占全屏也可以（但全屏下不能看到固定浮窗的反馈消息，不太建议。如果是ALT+ENTER退出全屏，还需要拖动一下游戏窗口，能看到任务栏即可）
        </span>
        <span class="note">
            <span style="font-weight: 700;">分辨率必须为 16：9</span> ，如
            3840×2160，2560X1440，1920×1080，1600×900，1366×768，1280×720
        </span>
        <span class="note">
            建议窗口模式下运行，分辨率越高越好，Api 建议使用高精度版
        </span>


        <a-divider />

        <div class="title">
            注意事项：
        </div>

        <span class="note">
            暂时没处理圣遗物的等级和星数，<span style="font-weight: 600;">导出的 json 可配合 worm 大佬的项目使用：莫娜占卜铺（见本程序的莫娜占卜铺）</span>
        </span>
        <span class="note">
            快速抓取模式下可以进行鼠标拖动（可以随便拖动背包界面），仅鼠标点击会被判定为有效。
        </span>
        <span class="note" style="font-weight: 600;">
            不要尝试在同一个圣遗物的详细界面多次点击鼠标，会重复录入
        </span>
        <span class="note">
            快速抓取模式下的点击不要太快，百度 api 默认限制 1 秒两次请求
        </span>
        <span class="note">
            由于百度OCR的结果经常把某些字符和数字漏掉，程序对一些异常的数值做了尝试性的修复，抓取三星圣遗物会存在过度修复的问题（后续会解决）
        </span>




        <span class="note">
            相关功能还在完善......

        </span>
        <!-- <a-divider /> -->
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            // clickbutton() {
            //     sendAxios()
            // }
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

    #third-content {
        padding: 50px;
        color: #404040;
        font-size: 14px;
        overflow: auto;
        height: 100%;
        background-color: rgb(250,250,250);
    }

    #third-content::-webkit-scrollbar {
        width: 8px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }



    #third-content::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(255, 151, 151, 0.2);
        background: #ffababea;

    }

    #third-content::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #EDEDED;

    }

    .note {
        width: 100%;
        line-height: 21px;
        margin-bottom: 7px;
        display: inline-block;
    }
</style>
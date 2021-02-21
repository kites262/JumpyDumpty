const ioHook = require('iohook')

const addonCatch = require('../build/Release/ArtifactsCatch.node')


const {
    globalShortcut,
    Notification
} = require('electron')


const {
    ocrArtifactDetails,
} = require('./ocr')

// const { set } = require('vue/types/umd')


let ifOCRHotKey = false
let ifOCRing = false
let ifInit = false

// 显示系统通知
function showNotification(res) {
    if (res == "open") {
        let notification = new Notification({
            title: '已开启热键',
            body: '请点击鼠标以抓取圣遗物'
        })
        notification.show()
        setTimeout(() => {
            notification.close()
        }, 1200);
    } else if (res == "close") {
        let notification = new Notification({
            title: '已关闭热键',
            body: "可导出圣遗物"
        })
        notification.show()
        setTimeout(() => {
            notification.close()
        }, 3500);
    }
}

function ocrShotCutRegister(contents) {
    globalShortcut.register("Alt+R", () => {
        // 关闭热键OCR
        if (ifOCRHotKey) {
            ifOCRHotKey = false
            contents.send("ocrShotCutClose")
            showNotification("close")
            console.log("close-ocr")
            ioStop()
        } else { // 开启
            if (!ifInit) {
                ifInit = true
                // 鼠标按下
                ioHook.on('mousedown', () => {
                    ifMouseClick = true
                });
                ioHook.on('mouseup', () => {
                    if (ifMouseClick && !ifOCRing) {
                        ifOCRing = true
                        contents.send("ocrShotCutWorking")
                        console.log("ocr-working")
                        setTimeout(ocrArtifac, 50)
                        setTimeout(() => {
                            ifOCRing = false
                        }, 50)
                    }
                });
                ioHook.on('mousedrag', () => {
                    ifMouseClick = false
                });
            }
            console.log("start-ocr")
            ifOCRHotKey = true
            showNotification("open")
            contents.send("ocrShotCutOpen")
            ioStart()
        }
    })
}



function ocrArtifac() {
    console.log("ready-to-catch")
    addonCatch.ArtifactsCatch()
    console.log("catched")

    ocrArtifactDetails(true)

}

let ifMouseClick = false

function ioStart() {
    ioHook.start()
}

function ioStop() {
    ioHook.stop()
}

function ioExit() {

    ioHook.unload()
    ioHook.stop()
}
module.exports = {
    ioExit,
    ocrShotCutRegister
}
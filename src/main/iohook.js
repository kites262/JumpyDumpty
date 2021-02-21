const ioHook = require('iohook')

const addonCatch = require('../build/Release/ArtifactsCatch.node')


const {
    globalShortcut
} = require('electron')


const {
    ocrArtifactDetails,
} = require('./ocr')

// const { set } = require('vue/types/umd')


let ifOCRHotKey = false
let ifOCRing = false
let ifInit = false

function ocrShotCutRegister(contents) {
    globalShortcut.register("Alt+R", () => {
        // 关闭热键OCR
        if (ifOCRHotKey) {
            ifOCRHotKey = false

            contents.send("ocrShotCutClose")
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
            contents.send("ocrShotCutOpen")
            ioStart()
        }
    })
}



function ocrArtifac() {
    console.log("ready-to-catch")
    addonCatch.ArtifactsCatch()
    console.log("catched")

    ocrArtifactDetails()

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
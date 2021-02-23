const {
    ipcMain,
    globalShortcut
} = require('electron')



const {
    initConfig,
    loadConfig,
    writeConfig,
    writeMapConfig,
    writeOcrConfig,
} = require('./opConfig')
const {
    ocrHotKeyRegister
} = require('./iohook')




function handleIPC(ipcData) {

    // OCR热键更改
    ipcMain.on('writeOCRHotKey', (e, data) => {
            globalShortcut.unregister(ipcData.ocrConfig.hotKey)
            ipcData.ocrConfig.hotKey = data
            writeOcrConfig(ipcData.ocrConfig)
            ocrHotKeyRegister(ipcData)
            // ipcData.contents.send("ocrHotKeyConflict")
    })

    // OCR去重更改
    ipcMain.on('writeIfDereplication', (e,data) => {
            ipcData.ocrConfig.ifDereplication = data
            console.log("writeIfDereplication")
            writeOcrConfig(ipcData.ocrConfig)
    })
}


module.exports = {
    handleIPC
}
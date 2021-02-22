const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    Menu,
    globalShortcut
} = require('electron')

const addonSwitch = require('./build/Release/SwitchToGame.node');
const addonCatch = require('./build/Release/ArtifactsCatch.node');
const path = require('path')
const gotTheLock = app.requestSingleInstanceLock()

const fs = require('fs')

const {
    initConfig,
    loadConfig,
    writeConfig,
    writeMapConfig,
    writeOcrConfig,
} = require('./main/opConfig')

const {
    getUserInfo
} = require('./main/getInfo')

const {
    getCookie,
    writeCookie
} = require('./main/getCookie')

const {
    getAccessToken,
    ocrArtifactDetails,
    artifactsReset,
    saveAccessToken,
    expoetToClicpBoard
} = require('./main/ocr')

const {
    ocrShotCutRegister
} = require('./main/iohook')





let win
let contents
let willQuitApp = false
let mapwin
let ocrConfig = {}
let config = {}
let mapConfig = {
    link: "",
    hotKey: "",
    ifHotKey: false,
    ifDelay: true,
}


function handleIPC() {
    ipcMain.on('createMap', () => {
        mapConfig.ifHotKey = true
        writeMapConfig(mapConfig)
        createMap()
    })
    ipcMain.on('destroyMap', () => {
        mapConfig.ifHotKey = false
        writeMapConfig(mapConfig)
        if (mapwin != null) {
            destroyMap()
            console.log("destroy")
        }
    })
    ipcMain.on('reloadMap', () => {
        reloadMap()
    })
    ipcMain.on('writeMapUrl', (e, data) => {
        mapConfig.link = data
        writeMapConfig(mapConfig)
    })
    ipcMain.on('writeMapIfDelay', (e, data) => {
        mapConfig.ifDelay = data
        writeMapConfig(mapConfig)
    })
    ipcMain.on('writeHotKey', (e, data) => {
        globalShortcut.unregister(mapConfig.hotKey)
        mapConfig.hotKey = data
        writeMapConfig(mapConfig)
        mapShotCutRegister()
    })
    ipcMain.on('getInfo', (e, data) => {
        getUserInfo(data, () => {
            e.reply('getInfoFinished')
        })
    })
    ipcMain.on('writeifAutoCookie', (e, data) => {
        config.ifAutoCookieButton = data
        writeConfig(config)
    })
    ipcMain.on('writeCookie', (e, data) => {
        writeCookie(data)
    })
    ipcMain.on('getCookie', (e) => {
        getCookie(() => {
            e.reply('getCookieFinished')
        })
    })
    ipcMain.on('artifactsCatch', (e) => {
        console.log("ready-to-catch")
        addonCatch.ArtifactsCatch()
        console.log("catched")
        ocrArtifactDetails(false, () => {
            e.reply("artifactsCatchFinished")
        })
    })
    ipcMain.on('writeApi', (e, value) => {
        console.log("ready-to-write-api")
        ocrConfig.api = value
        writeOcrConfig(ocrConfig)
    })
    ipcMain.on('getAccessToken', (e, value1, value2) => {
        getAccessToken(value1, value2, () => {
            e.reply("getAccessTokenFinished")
        })
    })
    ipcMain.on('saveAccessToken', (e, value) => {
        console.log("save-access-token")
        saveAccessToken(value)
    })
    ipcMain.on('artifactsReset', (e) => {
        artifactsReset(() => {
            e.reply("artifactsResetFinished")
        })
    })
    ipcMain.on('expoetToClicpBoard', (e) => {
        expoetToClicpBoard(() => {
            e.reply("expoetToClicpBoardFinished")
        })
    })

}

function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    })

    win.on('close', (e) => {
        if (willQuitApp) {
            win = null
        } else {
            e.preventDefault()
            win.hide()
        }

    })

    //创建系统通知区菜单
    tray = new Tray(path.resolve(__dirname, './assets/logo.ico'));
    const contextMenu = Menu.buildFromTemplate([{
            label: '退出',
            click: () => {
                // win.destroy()
                // app.quit()
                app.exit()
            }
        }, //直接强制退出
    ])
    tray.setToolTip('这是一个蹦蹦炸弹')
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
        win.isVisible() ? win.hide() : win.show()
        win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
    })

    // win.loadURL("http://localhost:8080")
    win.loadFile('./src/renderer/index.html')
    contents = win.webContents
}



function reloadMap() {
    // 开关打开才重载入
    if (mapConfig.ifHotKey) {
        if (mapwin == null) {
            createMap()
        } else {
            destroyMap()
            createMap()
        }
    }
}

function createMap() {
    let dataLink = ""
    fs.readFile(path.resolve(__dirname, '../../../config/mapconfig.json'), function (err, data) {
        if (err) {
            throw err;
        } else {
            dataLink = "https://" + JSON.parse(data.toString()).link
            // console.log(dataLink)
            mapwin = new BrowserWindow({
                width: 1920,
                height: 1080,
                frame: false,
                parent: win, //win是主窗口
                fullscreen: true,
                show: false
            })
            mapwin.hide()
            mapwin.loadURL(dataLink); //new.html是新开窗口的渲染进程
            console.log("load", dataLink)
            // globalShortcut.register(mapConfig.hotKey, () => {
            //     if (mapwin.isVisible()) {
            //         if (mapConfig.ifDelay) {
            //             addonSwitch.SwitchToGame()
            //             setTimeout(() => {
            //                 mapwin.hide()
            //             }, 500)
            //         } else {
            //             addonSwitch.SwitchToGame()
            //             mapwin.hide()
            //         }
            //     } else {
            //         mapwin.show()
            //     }
            // })
            mapShotCutRegister()

            mapwin.on('closed', () => {
                mapwin = null
            })
        }
    });
}


function destroyMap() {
    mapwin.destroy()
    globalShortcut.unregister(mapConfig.hotKey)
}

function mapShotCutRegister() {
    globalShortcut.register(mapConfig.hotKey, () => {
        if (mapwin.isVisible()) {
            if (mapConfig.ifDelay) {
                addonSwitch.SwitchToGame()
                setTimeout(() => {
                    mapwin.hide()
                }, 500)
            } else {
                addonSwitch.SwitchToGame()
                mapwin.hide()
            }
        } else {
            mapwin.show()
        }
    })
}




if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        //当运行第二个实例时,将会聚焦到win这个窗口

        if (win.isMinimized()) {
            win.restore()
        } else if (!win.isVisible()) {
            win.show()
            // win.setSkipTaskbar(true)
        }
        win.focus()

    })
    app.on('ready', () => {
        createWindow()
        initConfig(mapConfig, createMap, loadConfig) //加载设置，引用类型传参，加载后回调创建地图
        handleIPC()
        ocrShotCutRegister(contents)
        // getCookie()
    })
}


app.whenReady().then(() => {})


app.on('before-quit', () => {
    ioExit()
});


// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }

})

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
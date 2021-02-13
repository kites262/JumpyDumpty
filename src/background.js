const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    Menu,
    globalShortcut
} = require('electron')
const addon = require('./build/Release/SwitchToGame.node');
const path = require('path')
const gotTheLock = app.requestSingleInstanceLock()
const fs = require('fs')

const {
    initConfig,
    loadConfig,
    writeConfig,
} = require('./main/opConfig')




let win
let willQuitApp = false
let mapwin
let mapConfig = {
    link: "",
    hotKey: "",
    ifHotKey: false,
    ifDelay: true,
}



function handleIPC() {

    ipcMain.on('createMap', () => {
        mapConfig.ifHotKey = true
        // writeIfHotKey(true),
        // mapConfig.ifSwitch = true
        writeConfig(mapConfig)
        createMap()
    })
    ipcMain.on('destroyMap', () => {
        // writeIfHotKey(false)
        mapConfig.ifHotKey = false
        // writeIfHotKey(true),
        // mapConfig.ifSwitch = false
        writeConfig(mapConfig)
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
        writeConfig(mapConfig)
    })
    ipcMain.on('writeMapIfDelay', (e, data) => {
        mapConfig.ifDelay = data
        writeConfig(mapConfig)
        // writeIfDelay(data)
    })
    ipcMain.on('writeHotKey', (e, data) => {
        globalShortcut.unregister(mapConfig.hotKey)
        mapConfig.hotKey = data
        writeConfig(mapConfig)
        shotCutRegister()
        // writeIfDelay(data)
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


    win.loadFile('./src/renderer/index.html')
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
            //             addon.SwitchToGame()
            //             setTimeout(() => {
            //                 mapwin.hide()
            //             }, 500)
            //         } else {
            //             addon.SwitchToGame()
            //             mapwin.hide()
            //         }
            //     } else {
            //         mapwin.show()
            //     }
            // })
            shotCutRegister()

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

function shotCutRegister() {
    globalShortcut.register(mapConfig.hotKey, () => {
        if (mapwin.isVisible()) {
            if (mapConfig.ifDelay) {
                addon.SwitchToGame()
                setTimeout(() => {
                    mapwin.hide()
                }, 500)
            } else {
                addon.SwitchToGame()
                mapwin.hide()
            }
        } else {
            mapwin.show()
        }
    })
}

// app.on('ready', () => {
//     createWindow()
//     initConfig(mapConfig, createMap, loadConfig) //加载设置，引用类型传参，加载后回调创建地图
//     handleIPC()
// })


if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        //当运行第二个实例时,将会聚焦到win这个窗口

        if (win.isMinimized()) {
            win.restore()
        }
        else if (!win.isVisible()) {
            win.show()
            // win.setSkipTaskbar(true)
        }
        win.focus()

    })
    app.on('ready', () => {
        createWindow()
        initConfig(mapConfig, createMap, loadConfig) //加载设置，引用类型传参，加载后回调创建地图
        handleIPC()
    })
}


app.whenReady().then(() => {})


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
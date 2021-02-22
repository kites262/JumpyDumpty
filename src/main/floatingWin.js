const {
    BrowserWindow,
    ipcMain,
    screen,
    Menu,
    shell,
    app,
    webContents
} = require('electron')

let floatingWin




function createFloatingWindow() {
    floatingWin = new BrowserWindow({
        // width: 860, //悬浮窗口的宽度
        // height: 580, //悬浮窗口的高度
        width: 360, //悬浮窗口的宽度
        height: 250, //悬浮窗口的高度
        type: 'toolbar',
        show: false,
        frame: false, //要创建无边框窗口
        resizable: true, //禁止窗口大小缩放
        webPreferences: {
            // devTools: false //关闭调试

            nodeIntegration: true

        },
        transparent: true, //设置透明
        alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
    });

    let size = screen.getPrimaryDisplay().workAreaSize; //获取显示器的宽高
    let winSize = floatingWin.getSize(); //获取窗口宽高

    //设置窗口的位置 注意x轴要桌面的宽度 - 窗口的宽度
    let loopTimes = 100
    for (let i = 0; i < loopTimes; i++) {
        setTimeout(() => {
            floatingWin.setPosition(size.width - winSize[0], size.height - winSize[1]);
        }, 10);
    }
    // console.log(winSize)


    floatingWin.loadFile('./src/renderer/components/coms/index.html');
    floatingWin.show()

    floatingWin.on('close', () => {
        floatingWin.destroy()
        floatingWin = null;
    })
}

;



function sendMsgToFloatingWin(data) {
    // console.log("MSG",floatingWin.webContents)
    floatingWin.webContents.send("OCRDetailNotification", data)
}

function closeFloatingWindow(){
    floatingWin.destroy()
}
module.exports = {
    sendMsgToFloatingWin,
    createFloatingWindow,
    closeFloatingWindow
}
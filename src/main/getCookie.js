let {
    session
} = require('electron')

const path = require('path')
const fs = require('fs')

// 截取Cookie
function getCookie(callback) {
    let filter = {
        urls: ['https://webstatic.mihoyo.com/*']
    }
    let func = function (cookie) {
        writeCookie(cookie.Cookie, callback)
        func = function () {};
    }
    session.defaultSession.webRequest.onSendHeaders(filter, (details) => {
        // let reqHeaders = details.requestHeaders

        func(details.requestHeaders)

    })
}

// 写入Cookie，写入后回调：向渲染进程发送 已经得到Cookie的消息
function writeCookie(data, callback) {
    let writeData = {
        cookie: data,
    }
    fs.writeFile(path.resolve(__dirname, '../../../../data/cookie.json'), JSON.stringify(writeData, null, 4), (err) => {
        if (err) {
            throw err
        } else {
            console.log("write-cookie-success")
            if (callback) {
                callback()
            }
        }
    })
}




module.exports = {
    getCookie,
    writeCookie
}
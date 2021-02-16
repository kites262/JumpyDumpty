let {
    session
} = require('electron')

const path = require('path')
const fs = require('fs')

function getCookie() {
    let filter = {
        urls: ['https://webstatic.mihoyo.com/*']
    }
    let func = function (cookie) {
        writeCookie(cookie.Cookie)
        func = function () {};
    }
    session.defaultSession.webRequest.onSendHeaders(filter, (details) => {
        // let reqHeaders = details.requestHeaders

        func(details.requestHeaders)
 

    })
}

function writeCookie(data) {
    let writeData = {
        cookie: data,
    }
    fs.writeFile(path.resolve(__dirname, '../../../../data/cookie.json'), JSON.stringify(writeData, null, 4), (err) => {
        if (err) {
            throw err
        } else {
            console.log("write-cookie-success")
            session.defaultSession.webRequest = null
        }
    })
}

module.exports = {
    getCookie,writeCookie
}
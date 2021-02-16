const axios = require('axios')
// const qs = require('querystring')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const {
    // initRoleData,
    // loadRoleData,
    writeUserData,
    writeCharactersData
} = require('./opInfoData')
// var https = require('https');

// let uid = "121922061"
let mhyVersion = "2.2.1"
let cookie = ""
// let url = "https://api-takumi.mihoyo.com/game_record/genshin/api/index?server=" + getServer(uid) + "&role_id=" + uid;


// getUserInfo()


function readCookie(callback){
    fs.readFile(path.resolve(__dirname, '../../../../data/cookie.json'), function (err, data) {
        if (err) {
            // throw err;
        } else {
            dataRead = JSON.parse(data.toString())
            cookie = dataRead.cookie
            console.log("read-cookie-success")
            callback()
            // return cookie
        }
    });
}

function getUserInfo(uid,callback) {
    readCookie(()=>{
        axios.get("https://api-takumi.mihoyo.com/game_record/genshin/api/index?server=" + getServer(uid) + "&role_id=" + uid, {
            headers: {
                'cookie': cookie,
                'DS': getDS(),
                'Origin': 'https://webstatic.mihoyo.com',
                'x-rpc-app_version': '2.2.1',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 9; Unspecified Device) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36 miHoYoBBS/2.2.0',
                'x-rpc-client_type': '4',
                'Referer': 'https://webstatic.mihoyo.com/app/community-game-records/index.html?v=6',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,en-US;q=0.8',
                'X-Requested-With': 'com.mihoyo.hyperion',
                'Accept': 'application/json, text/plain, */*',
            },
        }).then((response) => {
            // console.log(response.data)
            // console.log(response.data.words_result)
            if (response.data.retcode == 0) {
                handleInfo(uid,response,callback)
            } else {
                console.log("getInfoERR:",response.data)
            }
            // console.log(response.data)
        }).catch((err) => {
            console.log(err)
        })
    })
  
}
// getCharactersInfo()

function getCharactersInfo(uid, characterIDs,callback) {
    roleInfoServer = getServer(uid)
    axios({
        url: "https://api-takumi.mihoyo.com/game_record/genshin/api/character",
        method: 'post',
        data: {
            "character_ids": characterIDs,
            "role_id": uid,
            "server": getServer(uid),
        },
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'cookie': cookie,
            'DS': getDS(),
            'Origin': 'https://webstatic.mihoyo.com',
            'x-rpc-app_version': '2.2.1',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; Unspecified Device) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36 miHoYoBBS/2.2.0',
            'x-rpc-client_type': '4',
            'Referer': 'https://webstatic.mihoyo.com/app/community-game-records/index.html?v=6',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,en-US;q=0.8',
            'X-Requested-With': 'com.mihoyo.hyperion',
            'Accept': 'application/json, text/plain, */*',
        }
    }).then(function (response) {
        writeCharactersData(response.data)
        // console.log("准备回调")
        callback()
        // console.log(response.data.words_result)
        // console.log(response.data.data.avatars.reliquaries)
        // console.log(response.data.data.avatars.constellations)
    }, function (err) {
        console.log('err')
    })
}

function handleInfo(uid,res,callback) {
    let data = res.data
    let characterIDs = []
    writeUserData(data)
    if (data.retcode != 0) {
        return (
            "Api报错，返回内容为：\r\n" +
            res
        )
    } else {
        characterList = data.data.avatars
        for (let item of characterList) {
            characterIDs.push(item.id)
        }
        getCharactersInfo(uid, characterIDs,callback)
    }
}


// 获取服务器名字
function getServer(uid) {
    if (uid[0] == "1") {
        return "cn_gf01"
    } else if (uid[0] == "5") {
        return "cn_qd01"
    }
    return ""
}


// 获取签名
function getDS() {
    let n
    if (mhyVersion == "2.1.0") {
        n = crypto.createHash('md5').update(mhyVersion).digest("hex")
    } else if (mhyVersion == "2.2.1") {
        n = "cx2y9z9a29tfqvr1qsq6c7yz99b5jsqt"
    } else {
        mhyVersion = "2.2.1"
        n = "cx2y9z9a29tfqvr1qsq6c7yz99b5jsqt"
    }
    let i = Math.round(((new Date().getTime()) / 1000)).toString()


    let r = randomString(6)
    let c = crypto.createHash('md5').update("salt=" + n + "&t=" + i + "&r=" + r).digest("hex")
    // console.log(i + "," + r + "," + c)
    return (i + "," + r + "," + c)
}

// 生成随机字符串
function randomString(e) {
    let t = "0123456789abcdefghijklmnopqrstuvwxyz",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

module.exports = {
    getUserInfo
}
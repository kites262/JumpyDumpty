var https = require('https');
var qs = require('querystring');
const path = require('path')
const fs = require('fs')
const {
    clipboard,
    Notification
} = require('electron')
const axios = require('axios')
const {
    toSetName,
    toPostionName,
    toTagName,
    setToDetail
} = require('./ocrData/Artifacts.json')

// 显示系统通知
function showNotification(res, msg) {
    if (res == "success") {
        let notification = new Notification({
            title: 'OCR成功',
            body: '请继续点击下一个圣遗物'
        })
        notification.show()
        setTimeout(() => {
            notification.close()
        }, 1200);
    } else if (res == "error") {
        let notification = new Notification({
            title: 'OCR失败',
            body: msg
        })
        notification.show()
        setTimeout(() => {
            notification.close()
        }, 4500);
    }
}


// 获取AccessToken
function getAccessToken(value1, value2, callback) {
    let param = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': value1.replace(/\s*/g, ""),
        'client_secret': value2.replace(/\s*/g, "")
    });
    https.get({
        hostname: 'aip.baidubce.com',
        path: '/oauth/2.0/token?' + param,
        agent: false
    }, function (res) {
        // 在标准输出中查看运行结果
        // 写入文件
        res.pipe(fs.createWriteStream(path.resolve(__dirname, '../../../../config/baiduToken.json')));
        console.log("ready-to-get-token-callback")
        callback()
    });
}

function saveAccessToken(value) {
    fs.readFile(path.resolve(__dirname, '../../../../config/baiduToken.json'), function (err, data) {
        if (err) {
            // throw err;
            // 文件不存在
            let tokenData = {
                access_token: value
            }
            fs.writeFile(path.resolve(__dirname, '../../../../config/baiduToken.json'), JSON.stringify(tokenData, null, 4), (err) => {
                if (err) throw err
            })
        } else {
            let tokenData = JSON.parse(data.toString())
            tokenData[access_token] = value
            fs.writeFile(path.resolve(__dirname, '../../../../config/baiduToken.json'), JSON.stringify(tokenData, null, 4), (err) => {
                if (err) throw err
            })
        }

    })
}

function ocrArtifactDetails(ifShow, callback) {
    let img = clipboard.readImage()
    if (!img.isEmpty()) {
        let imgUrl = img.toDataURL()
        let {
            api
        } = require('../../../../config/ocrConfig.json')
        // console.log(imgUrl)
        fs.writeFile(path.resolve(__dirname, '../../../../data/artifact.jpg'), Buffer.from(imgUrl.replace('data:image/png;base64,', ''), 'base64'), (err) => {
            console.log('save-img-success')
            let config = require('../../../../config/baiduToken.json')
            let access_token = config["access_token"]
            fs.readFile(path.resolve(__dirname, '../../../../data/artifact.jpg'), function (err, data) {
                if (err) {
                    throw err
                } else {
                    let image = data
                    let imgData = Buffer.from(image).toString('base64');
                    axios({
                        url: api + access_token,
                        method: 'post',
                        data: qs.stringify({
                            'image': imgData
                        }),
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function (response) {
                        
                         
                            // console.log(response.data)
                      
                            handleOcrData(response.data, ifShow, callback)
                        

                    }, function (err) {
                        if (ifShow) {
                            showNotification("error", "发送申请失败")
                        }
                    })
                }
            })
        })
    }
}

function handleOcrData(ocrData, ifShow, callback) {
    // console.log("enter")
    let artifactData = {
        mainTag: {},
        normalTags: []
    }
    let ifmainTagValue = false
    let ifOCRFinished = false
    console.log("ready")

    fs.writeFile(path.resolve(__dirname, '../../../../data/ocrData.json'), JSON.stringify(ocrData, null, 4), (err) => {
        if (err) throw err
        else {
            console.log("write-ocrData")
        }
    })

    // 字数过少，有问题
    if(ocrData.words_result_num<8){
        if (ifShow) {
            showNotification("error", "OCR返回结果过少，请检查游戏分辨率和打开的界面是否正确")
        }
        callback()
        return
    }
    // 返回了错误代码,有问题
    if(ocrData.error_code){
        if (ifShow) {
            // 图片尺寸问题
            if(ocrData.error_code==216202){
                showNotification("error", "图片尺寸存在问题，请检查游戏是否保持前台")
            }else if(ocrData.error_code==18){   //申请过快
                showNotification("error", "OCR申请过于频繁，请减慢点击速度")
            }
        }
        callback()
        return
    }
    
if(ocrData.words_result_num)

    for (let item of ocrData.words_result) {
        if (!ifOCRFinished) {
            // 获取位置名字
            if (item.words in toPostionName) {
                artifactData.position = toPostionName[item.words]
                continue
            }

            // 获取主属性名称
            if (item.words in toTagName) {
                if (artifactData.position == "flower") {
                    artifactData.mainTag.name = toTagName["固定生命值"]
                } else if (artifactData.position == "feather") {
                    artifactData.mainTag.name = toTagName["固定攻击力"]
                } else {

                    artifactData.mainTag.name = toTagName[item.words]
                }
                ifmainTagValue = true
                continue
            }

            // 获取主属性的数值
            if (ifmainTagValue) {
                if (isNaN(item.words.replace(/,|%/g, ""))) {
                    console.log("--------------------")
                    continue
                }
                ifmainTagValue = false

                // 花和羽
                if (artifactData.position == "flower" || artifactData.position == "feather") {
                    // 有逗号的普通数值
                    if (item.words.indexOf(",") >= 0) {
                        artifactData.mainTag.value = parseInt(item.words.replace(/,/g, ""))
                    }
                    //普通数值 
                    else {
                        artifactData.mainTag.value = parseInt(item.words)
                    }
                } else {
                    // 百度OCR可能有识别不了百分号的情况，这里按有无百分号处理
                    // 只有元素精通无百分号
                    if (artifactData.mainTag.name == "elementalMastery") {
                        artifactData.mainTag.value = parseInt(item.words)
                    } else {
                        // 甚至可能识别不了小数点
                        if (item.words.replace(/%/g, "") > 62.2) {
                            artifactData.mainTag.value = parseFloat(item.words.replace(/%/g, "")) / 1000
                        } else {
                            artifactData.mainTag.value = parseFloat(item.words.replace(/%/g, "")) / 100
                        }
                    }
                }
                continue
            }

            // 获取副属性
            for (let tagName in toTagName) {
                if (item.words.indexOf(tagName) >= 0) {
                    let ifPercentageTag = false
                    let normalTag = {
                        name: "",
                        value: ""
                    }
                    // 找副属性的+号
                    if (item.words.indexOf("+") >= 0) {

                        normalTag.value = item.words.substring(item.words.indexOf("+") + 1)
                        // 百分号数值
                        if (normalTag.value.indexOf("%") >= 0) {
                            ifPercentageTag = true

                            // 百度OCR可能有识别不了小数点的情况
                            if (normalTag.value.replace(/%/g, "") > 46.8) {
                                normalTag.value = parseFloat(normalTag.value.replace(/%/g, "")) / 1000
                            } else {
                                normalTag.value = parseFloat(normalTag.value.replace(/%/g, "")) / 100
                            }
                        }
                        // 还会漏百分号
                        else if (tagName == "暴击率" || tagName == "暴击伤害" || tagName == "元素充能效率") {
                            ifPercentageTag = true
                            if (normalTag.value > 46.8) {
                                normalTag.value = parseFloat(normalTag.value) / 1000
                            } else {
                                normalTag.value = parseFloat(normalTag.value) / 100
                            }
                        }
                        // 有逗号的普通数值
                        else if (normalTag.value.indexOf(",") >= 0) {
                            normalTag.value = parseInt(normalTag.value.replace(/,/g, ""))
                        }
                        //普通数值 
                        else {

                            normalTag.value = parseInt(normalTag.value)
                        }
                    }
                    if (ifPercentageTag) {
                        normalTag.name = toTagName[tagName]
                    } else {
                        if (tagName == "攻击力") {
                            normalTag.name = toTagName["固定攻击力"]
                        } else if (tagName == "防御力") {
                            normalTag.name = toTagName["固定防御力"]
                        } else if (tagName == "生命值") {
                            normalTag.name = toTagName["固定生命值"]
                        } else {
                            normalTag.name = toTagName[tagName]
                        }
                    }
                    artifactData.normalTags.push(normalTag)
                    break
                }
            }

            // 获取套装名字
            for (let setName in toSetName) {
                if (item.words.indexOf(setName) >= 0) {
                    artifactData["setName"] = toSetName[setName]
                    ifOCRFinished = true
                    break
                }
            }
        }
    }

    setsName = setToDetail[artifactData.setName]

    artifactData.detailName = setsName[artifactData.position]
    artifactData.omit = false


    writeOCRData(artifactData, ifShow, callback)
}

function writeOCRData(writeData, ifShow, callback) {
    fs.readFile(path.resolve(__dirname, '../../../../data/artifacts.json'), function (err, data) {
        if (err) {
            if (ifShow) {
                showNotification("error", "读取圣遗物记录失败")
            }
            // throw err;
        } else {
            let dataSource = JSON.parse(data.toString())
            if (Object.keys(dataSource).length != 0) {
                let maxId = 1
                // 找到圣遗物列表最大ID
                // console.log(typeof(dataSource),dataSource)
                for (let itemName in dataSource) {
                    if (dataSource[itemName].length == 0) {
                        continue
                    } else {

                        let temp = dataSource[itemName]
                        if (temp[temp.length - 1].id > maxId) {
                            maxId = temp[temp.length - 1].id
                        }

                    }
                }
                writeData.id = ++maxId
                dataSource[writeData.position].push(writeData)
            } else {
                writeData.id = 1
                // 初始化
                dataSource = {
                    flower: [],
                    feather: [],
                    sand: [],
                    cup: [],
                    head: []
                }
                dataSource[writeData.position].push(writeData)
            }
            fs.writeFile(path.resolve(__dirname, '../../../../data/artifacts.json'), JSON.stringify(dataSource, null, 4), (err) => {
                if (err) throw err
                else {
                    console.log("write-artifacts")
                    if (ifShow) {
                        showNotification("success")
                    }
                    if (callback) {
                        callback()
                    }
                }
            })
        }
    });
}


function artifactsReset(callback) {
    let data = {}
    fs.writeFile(path.resolve(__dirname, '../../../../data/artifacts.json'), JSON.stringify(data, null, 4), (err) => {
        if (err) throw err
        else {
            console.log("reset")
            if (callback) {
                callback()
            }
        }
    })
}

function expoetToClicpBoard(callback) {
    fs.readFile(path.resolve(__dirname, '../../../../data/artifacts.json'), function (err, data) {
        if (err) {
            // throw err;
        } else {
            clipboard.writeText(data.toString())
            if (callback) {
                callback()
            }
        }
    })
}
module.exports = {

    getAccessToken,
    saveAccessToken,
    ocrArtifactDetails,
    artifactsReset,
    expoetToClicpBoard
}
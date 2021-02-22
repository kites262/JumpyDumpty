const path = require('path')
const fs = require('fs')


function initConfig(mapConfig, createMap, callback) {

    fs.mkdir(path.resolve(__dirname, '../../../../config'), function (error) {
        if (error) {
            // if (error.code == 'EEXIST') {
            //     fs.writeFile(path.resolve(__dirname, '../../../config/mapconfig.json'), mapConfigWrite, (err) => {
            //         if (err) throw err
            //     })
            // } else {
            //     console.log(error);
            //     return false;
            // }
            // 文件夹已创建
            callback(mapConfig, createMap)
        } else {

            let mapConfigWrite = {
                link: "webstatic.mihoyo.com/app/ys-map-cn/index.html?bbs_presentation_style=no_header&ts=1606133548270#/map/2?utm_source=bbs&utm_medium=mys&utm_campaign=slm&shown_types=&center=1675.00,-1190.00&zoom=-1.00",
                hotKey: "Alt+E",
                ifHotKey: false,
                ifDelay: true,
            }
            let configWrite = {
                ifAutoCookieButton: false,
            }
            let cookieWrite = {
                cookie: "",
            }
            let ocrConfigWrite={
                api:'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token='
            }
            let artifactsWrite={

            }
            let baiduTokenWrite={
                access_token:""
            }
            
            fs.writeFile(path.resolve(__dirname, '../../../../config/baiduToken.json'), JSON.stringify(baiduTokenWrite, null, 4), (err) => {
                if (err) throw err
                else {
                    callback(mapConfig, createMap)
                }
            })
            fs.writeFile(path.resolve(__dirname, '../../../../config/mapconfig.json'), JSON.stringify(mapConfigWrite, null, 4), (err) => {
                if (err) throw err
                else {
                    callback(mapConfig, createMap)
                }
            })
            fs.writeFile(path.resolve(__dirname, '../../../../config/config.json'),  JSON.stringify(configWrite, null, 4), (err) => {
                if (err) throw err
                else {

                }
            })
            fs.writeFile(path.resolve(__dirname, '../../../../config/ocrConfig.json'), JSON.stringify(ocrConfigWrite, null, 4), (err) => {
                if (err) throw err
                else {

                }
            })
  
            fs.mkdir(path.resolve(__dirname, '../../../../data'), function (error) {
                if (error) {
                } else {
                    fs.writeFile(path.resolve(__dirname, '../../../../data/cookie.json'), JSON.stringify(cookieWrite, null, 4), (err) => {
                        if (err) throw err
                        else {

                        }
                    })
                    fs.writeFile(path.resolve(__dirname, '../../../../data/artifacts.json'),JSON.stringify(artifactsWrite, null, 4), (err) => {
                        if (err) throw err
                        else {
        
                        }
                    })
                }
            })

        }

    })

}

function loadConfig(mapConfig, callback) {
    // initConfig()
    let dataConfig = {}
    fs.readFile(path.resolve(__dirname, '../../../../config/mapconfig.json'), function (err, data) {
        if (err) {
            // throw err;
        } else {
            dataConfig = JSON.parse(data.toString())

            mapConfig.link = dataConfig.link
            mapConfig.hotKey = dataConfig.hotKey
            mapConfig.ifHotKey = dataConfig.ifHotKey
            mapConfig.ifDelay = dataConfig.ifDelay
            if (dataConfig.ifHotKey) {
                callback()
            }
            console.log(mapConfig)
        }
    });
}


function writeMapConfig(mapConfig) {
    fs.writeFile(path.resolve(__dirname, '../../../../config/mapconfig.json'), JSON.stringify(mapConfig, null, 4), (err) => {
        if (err) throw err
    })

}

function writeConfig(config) {
    fs.writeFile(path.resolve(__dirname, '../../../../config/config.json'), JSON.stringify(config, null, 4), (err) => {
        if (err) throw err
    })

}
function writeOcrConfig(config) {
    fs.writeFile(path.resolve(__dirname, '../../../../config/ocrConfig.json'), JSON.stringify(config, null, 4), (err) => {
        if (err) throw err
    })
}

module.exports = {
    initConfig,
    loadConfig,
    writeMapConfig,
    writeConfig,
    writeOcrConfig
}
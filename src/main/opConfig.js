const path = require('path')
const fs = require('fs')


function initConfig(mapConfig,createMap,callback) {
    let dataConfig = {
        link: "webstatic.mihoyo.com/app/ys-map-cn/index.html?bbs_presentation_style=no_header&ts=1606133548270#/map/2?utm_source=bbs&utm_medium=mys&utm_campaign=slm&shown_types=&center=1675.00,-1190.00&zoom=-1.00",
        hotKey: "Alt+E",
        ifHotKey: false,
        ifDelay: true,
    }
    dataConfig = JSON.stringify(dataConfig, null, 4)
    fs.mkdir(path.resolve(__dirname, '../../../../config'), function (error) {
        if (error) {
            // if (error.code == 'EEXIST') {
            //     fs.writeFile(path.resolve(__dirname, '../../../config/mapconfig.json'), dataConfig, (err) => {
            //         if (err) throw err
            //     })
            // } else {
            //     console.log(error);
            //     return false;
            // }
            callback(mapConfig,createMap)
        } else {
            fs.writeFile(path.resolve(__dirname, '../../../../config/mapconfig.json'), dataConfig, (err) => {
                if (err) throw err
                else {
                    callback(mapConfig,createMap)
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


function writeConfig(mapConfig) {

    fs.writeFile(path.resolve(__dirname, '../../../../config/mapconfig.json'), JSON.stringify(mapConfig, null, 4), (err) => {
        if (err) throw err
    })

}


module.exports = {
    initConfig,
    loadConfig,
    writeConfig
}
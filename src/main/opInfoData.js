const path = require('path')
const fs = require('fs')


// function initRoleData(roleInfo,createMap,callback) {
//     let roleInfo = {
//         link: "webstatic.mihoyo.com/app/ys-map-cn/index.html?bbs_presentation_style=no_header&ts=1606133548270#/map/2?utm_source=bbs&utm_medium=mys&utm_campaign=slm&shown_types=&center=1675.00,-1190.00&zoom=-1.00",
//         hotKey: "Alt+E",
//         ifHotKey: false,
//         ifDelay: true,
//     }
//     roleInfo = JSON.stringify(roleInfo, null, 4)
//     fs.mkdir(path.resolve(__dirname, '../../../../config'), function (error) {
//         if (error) {
//             // if (error.code == 'EEXIST') {
//             //     fs.writeFile(path.resolve(__dirname, '../../../config/roleInfo.json'), roleInfo, (err) => {
//             //         if (err) throw err
//             //     })
//             // } else {
//             //     console.log(error);
//             //     return false;
//             // }
//             callback(roleInfo,createMap)
//         } else {
//             fs.writeFile(path.resolve(__dirname, '../../../../config/roleInfo.json'), roleInfo, (err) => {
//                 if (err) throw err
//                 else {
//                     callback(roleInfo,createMap)
//                 }
//             })
//         }

//     })

// }

// function loadRoleData(roleInfo, callback) {
//     // initRoleData()
//     let roleInfo = {}
//     fs.readFile(path.resolve(__dirname, '../../../../config/roleInfo.json'), function (err, data) {
//         if (err) {
//             // throw err;
//         } else {
//             roleInfo = JSON.parse(data.toString())

//             roleInfo.link = roleInfo.link
//             roleInfo.hotKey = roleInfo.hotKey
//             roleInfo.ifHotKey = roleInfo.ifHotKey
//             roleInfo.ifDelay = roleInfo.ifDelay
//             if (roleInfo.ifHotKey) {
//                 callback()
//             }
//             console.log(roleInfo)
//         }
//     });
// }

function writeUserData(userInfo) {
    fs.writeFile(path.resolve(__dirname, '../../../../data/userInfo.json'), JSON.stringify(userInfo, null, 4), (err) => {
        if (err) throw err
    })
}
function writeCharactersData(charactersInfo) {
    fs.writeFile(path.resolve(__dirname, '../../../../data/charactersInfo.json'), JSON.stringify(charactersInfo, null, 4), (err) => {
        if (err) throw err
    })
}
function writeSpiralAbyssData(spiralAbyssInfo) {
    fs.writeFile(path.resolve(__dirname, '../../../../data/spiralAbyssInfo.json'), JSON.stringify(spiralAbyssInfo, null, 4), (err) => {
        if (err) throw err
    })
}
module.exports = {
    // initRoleData,
    // loadRoleData,
    writeUserData,
    writeCharactersData,
    writeSpiralAbyssData
}
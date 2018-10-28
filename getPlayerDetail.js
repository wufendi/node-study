// mongoosejs.com/docs/index.html
// 获取球员的具体信息
const mongoose = require('mongoose');
const http = require('http');
const db = mongoose.connection;
const Schema = mongoose.Schema;
let currentModel;
let currentSchema;
let i = 0
currentSchema = new Schema({// http://china.nba.com/static/data/player/stats_alex_abrines.json
    name: String,
    team: String,
    country: String,
    firstNameEn: String,
    lastNameEn: String,
    displayName: String,
    playerProfile: Object,
    stats: Object,
    teamProfile: Object,
}, {collection:'playerDetail'});
currentModel = mongoose.model('playerDetail', currentSchema);
function setData(name,isRemove) {
    name = name.toLowerCase();
    if (isRemove) {
        currentModel.remove(function () {});
    }
    getPlayerData(name, currentModel);
}
function getData(url,fn) {
    http.get(url, function(res) {
        if (res.statusCode === 200) {
            console.log(i++);
            let all_data = '';
            res.on('data', function(data) {
                all_data += data;
            });
            res.on('end', function() {
                all_data = JSON.parse(all_data);
                all_data = all_data.payload;
                fn(all_data)
            })
        }

    });
}
function getPlayerData(name, modal) {
    const url = `http://china.nba.com/static/data/player/stats_${name}.json`;
    getData(url,(data)=>{
        const _data = {
            name: data.player.playerProfile.code, // 英文名
            team: data.player.teamProfile.name, // 球队
            country: data.player.playerProfile.country, // 国家
            firstNameEn: data.player.playerProfile.firstNameEn,
            lastNameEn: data.player.playerProfile.lastNameEn, // 中文名
            displayName: data.player.playerProfile.displayName,
            playerProfile: data.player.playerProfile,
            stats: data.player.stats,
            teamProfile: data.player.teamProfile
        }
        modal.create(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}

function getAllPlayerName (userOption) {
    const playersSchema = new Schema({
        name: String,
    });
    const playersModel = mongoose.model('currentPlayers', playersSchema);
    const defaultOption = {_id: 0};
    const option = Object.assign({}, defaultOption, userOption)
    playersModel.find({}, option, function (err, data) {
        if (!err) {
           data.forEach((v, i) =>{
               const isRemove = i === 0;
               setTimeout(() => {
                   setData(v.name, isRemove);
               } ,100*i);
           });
        } else {
            console.log('获取数据失败');
            throw err;
        }
    })
}
mongoose.connect('mongodb://localhost/nba');
db.on('error',() => {
    console.log('连接失败')
});
db.once('open', function() {
    console.log('连接成功')
});
db.once('close', function() {
    console.log('断开成功')
});
getAllPlayerName({});
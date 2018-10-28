// mongoosejs.com/docs/index.html
// 获取球队的具体信息 资料/赛程/数据/数据王/球员/对比
const mongoose = require('mongoose');
const getAllTeamData = require('./getAllTeamData');
const http = require('http');
const db = mongoose.connection;
const Schema = mongoose.Schema;
let currentModel;
let currentSchema;
let i = 0
currentSchema = new Schema({// http://china.nba.com/static/data/player/stats_alex_abrines.json
    name: String,
    monthGroups: Array, // 赛程 http://china.nba.com/static/data/team/schedule_warriors.json data.payload.monthGroups
    data: Array, // 数据 常规赛/季后赛 http://china.nba.com/static/data/team/stats_warriors.json data.payload。seasons
    info: Object, // 教练 http://china.nba.com/static/data/team/standing_warriors.json
    datace: Object, // 数据王 http://china.nba.com/static/data/team/leader_warriors.json data.payload.{}
    players: Array, // 球员 http://china.nba.com/static/data/team/playerstats_warriors.json
    contrast: Array, //对比 http://china.nba.com/static/data/team/hotzone_warriors.json http://china.nba.com/static/data/league/teamhotzone.json
}, {collection:'teamDetail'});
currentModel = mongoose.model('teamDetail', currentSchema);
function setData(name, isRemove) {
    name = name.toLowerCase();
    const data = {
        name,
        monthGroups: [],
        data: [],
        info: {},
        datace: {},
        players: [],
        contrast: [],
    }
    if (isRemove) {
        currentModel.remove(function () {});
    }
    console.log(i++);
    currentModel.create(data, (err) => {
        if (err) {
            throw err;
        }
    })
    getMonthGroupsData(name, currentModel);
    getSeasonsData(name, currentModel);
    getInfoData(name, currentModel);
    getDatace(name, currentModel);
    getPlayersData(name, currentModel);
    getContrastData(name, currentModel);
}
function getData(url,fn) {
    http.get(url, (res) => {
        let all_data = '';
        res.on('data', (data) => {
            all_data += data;
        });
        res.on('end', () => {
            all_data = JSON.parse(all_data);
            all_data = all_data.payload;
            fn(all_data)
        })
    });
}

function getMonthGroupsData(name, modal) {
    const url = `http://china.nba.com/static/data/team/schedule_${name}.json`;
    getData(url,(data)=>{
        modal.findOneAndUpdate({name}, { $set: { monthGroups: data.monthGroups }}, (err) => {
            if (err) {
                throw err;
            }
        })
    });
}
function getSeasonsData(name, modal) {
    const url = `http://china.nba.com/static/data/team/stats_${name}.json`;
    getData(url,(data)=>{
        modal.findOneAndUpdate({name}, { $set: { data: data.seasons }}, (err) => {
            if (err) {
                throw err;
            }
        })
    });
}
function getInfoData(name, modal) {
    const url = `http://china.nba.com/static/data/team/standing_${name}.json`;
    getData(url,(data)=>{
        modal.findOneAndUpdate({name}, { $set: { info: data.team }}, (err) => {
            if (err) {
                throw err;
            }
        });
    });
}
function getDatace(name, modal) {
    const url = `http://china.nba.com/static/data/team/leader_${name}.json`;
    getData(url,(data)=>{
        modal.findOneAndUpdate({name}, { $set: { datace: data }}, (err) => {
            if (err) {
                throw err;
            }
        });
    });
}
function getPlayersData(name, modal) {
    const url = `http://china.nba.com/static/data/team/playerstats_${name}.json`;
    getData(url,(data)=>{
        modal.findOneAndUpdate({name}, { $set: { players: data.team.players }}, (err) => {
            if (err) {
                throw err;
            }
        });
    });
}
function getContrastData(name, modal) {
    const url = `http://china.nba.com/static/data/team/hotzone_${name}.json`;
    getData(url,(data)=>{
        modal.findOneAndUpdate({name}, { $set: { contrast: data.hotZone.seasons }}, (err) => {
            if (err) {
                throw err;
            }
        });
    });
}

// setData('warriors');
getAllTeamData({code: 1}, (data) => {
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
    // 以上 如果放在外面 数据会保存在NBA中
    data.forEach((v, i) => {
        const isRemove = i === 0;
        setTimeout(()=> {
            setData(v.code, isRemove);
        }, i*10000)
    })
})
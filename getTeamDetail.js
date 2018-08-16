// mongoosejs.com/docs/index.html
// 获取球队的具体信息 资料/赛程/数据/数据王/球员/对比
const mongoose = require('mongoose');
const getAllTeamData = require('./getAllTeamData');
const http = require('http');
const db = mongoose.connection;
const Schema = mongoose.Schema;
function setData(name) {
    let teamDetailModel;
    let teamDetailSchema;
    name = name.toLowerCase();
    teamDetailSchema = new Schema({
        monthGroups: Array, // 赛程 http://china.nba.com/static/data/team/schedule_warriors.json data.payload.monthGroups
        data: Array, // 数据 常规赛/季后赛 http://china.nba.com/static/data/team/stats_warriors.json data.payload。seasons
        info: Object, // 教练 http://china.nba.com/static/data/team/standing_warriors.json
        datace: Object, // 数据王 http://china.nba.com/static/data/team/leader_warriors.json data.payload.{}
        players: Array, // 球员 http://china.nba.com/static/data/team/playerstats_warriors.json
        contrast: Array, //对比 http://china.nba.com/static/data/team/hotzone_warriors.json http://china.nba.com/static/data/league/teamhotzone.json
    }, {collection:name});
    teamDetailModel = mongoose.model(name, teamDetailSchema);
    teamDetailModel.create({monthGroups:[],data:[],info:{},datace:{},players: [],contrast:[]}, (err) => {
        if (err) {
            throw err;
        } else {
            console.log('初始化成功');
        }
    });
    teamDetailModel.remove(function () {});

    getMonthGroupsData(name, teamDetailModel);
    getSeasonsData(name, teamDetailModel);
    getInfoData(name, teamDetailModel);
    getDatace(name, teamDetailModel);
    getPlayersData(name, teamDetailModel);
    getContrastData(name, teamDetailModel);
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
        const _data = {
            monthGroups: data.monthGroups
        }
        modal.updateOne(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}
function getSeasonsData(name, modal) {
    const url = `http://china.nba.com/static/data/team/stats_${name}.json`;
    getData(url,(data)=>{
        const _data = {
            data: data.seasons
        }
        modal.updateOne(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}
function getInfoData(name, modal) {
    const url = `http://china.nba.com/static/data/team/standing_${name}.json`;
    getData(url,(data)=>{
        const _data = {
            info: data.team
        }
        modal.updateOne(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}
function getDatace(name, modal) {
    const url = `http://china.nba.com/static/data/team/leader_${name}.json`;
    getData(url,(data)=>{
        const _data = {
            datace: data
        }
        modal.updateOne(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}
function getPlayersData(name, modal) {
    const url = `http://china.nba.com/static/data/team/playerstats_${name}.json`;
    getData(url,(data)=>{
        const _data = {
            players: data.team.players
        }
        modal.updateOne(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}
function getContrastData(name, modal) {
    const url = `http://china.nba.com/static/data/team/hotzone_${name}.json`;
    getData(url,(data)=>{
        const _data = {
            contrast: data.hotZone.seasons
        }
        modal.updateOne(_data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('插入成功');
            }
        })
    });
}


mongoose.connect('mongodb://localhost/teamDetail');
db.on('error',() => {
    console.log('连接失败')
});
db.once('open', function() {
    console.log('连接成功')
});
db.once('close', function() {
    console.log('断开成功')
});
// setData('warriors');
getAllTeamData({code: 1}, (data) => {
    mongoose.connect('mongodb://localhost/teamDetail');
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
        setData(v.code);
    })
})
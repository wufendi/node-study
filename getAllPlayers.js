// mongoosejs.com/docs/index.html
// 获取所有球员列表
const mongoose = require('mongoose');
const http = require('http');
const db = mongoose.connection;
const Schema = mongoose.Schema;
function setData(name) {
    let currentModal;
    let currentSchema;
    name = name.toLowerCase();
    currentSchema = new Schema({
        name: String, // 赛程 http://china.nba.com/static/data/league/playerlist.json // 现役球员
    }, {collection:name});
    currentModal = mongoose.model(name, currentSchema);
    currentModal.remove(function () {});
    getCurrentPlayersData(currentModal);
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

function getCurrentPlayersData(modal) {
    const url = `http://china.nba.com/static/data/league/playerlist.json`;
    getData(url,(data)=>{
        data.players.forEach((v, i) => {
            modal.create({name: v.playerProfile.code}, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('插入成功');
                }
            })
        })
    });
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

setData('currentPlayers');
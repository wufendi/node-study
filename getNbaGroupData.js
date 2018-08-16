// mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
let http = require('http');
mongoose.connect('mongodb://localhost/nba');
// 监听
let db = mongoose.connection;
let target_url = 'http://china.nba.com/static/data/league/conferenceteamlist.json';
let Schema = mongoose.Schema;
let groupSchema = new Schema({
    abbr: String,
    city: String,
    cityEn: String,
    code: String,
    conference: String,
    displayAbb: String,
    displayConference: String,
    division: String,
    id: String,
    isAllStarTeam: Boolean,
    isLeagueTeam: Boolean,
    leagueId: String,
    name: String,
    nameEn: String,
});
let groupsModel = mongoose.model('groups', groupSchema);
function setData(data, modal) {
    let target_data = [];
    data.forEach((v, i) => {
        const teams = v.teams;
        teams.forEach((s_v, s_i) => {
            target_data.push(s_v.profile);
        })
    });
    modal.create(target_data, (err) => {
        if (err) {
            throw err;
        } else {
            console.log('插入成功');
        }
    })
}
db.on('error',() => {
    console.log('连接失败')
});
db.once('open', function() {
    console.log('连接成功')
});
db.once('close', function() {
    console.log('断开成功')
});
http.get(target_url, (res) => {
    let all_data = '';
    res.on('data', (data) => {
        all_data += data;
    });
    res.on('end', () => {
        all_data = JSON.parse(all_data);
        setData(all_data.payload.listGroups, groupsModel)
    })
});

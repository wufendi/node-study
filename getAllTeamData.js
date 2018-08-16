// mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
let db = mongoose.connection;
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
function getAllTeamData(userOption,fn) {
    const defaultOption = {_id: 0};
    const option = Object.assign({}, defaultOption, userOption)
    groupsModel.find({}, option, (err, data) => {
        console.log(data);
        if (!err) {
            fn(data)
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
module.exports = getAllTeamData;
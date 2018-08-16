// mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
let http = require('http');
mongoose.connect('mongodb://localhost/nba');
// 监听
let db = mongoose.connection;
let target_url = 'http://china.nba.com/static/data/season/conferencestanding.json';
let Schema = mongoose.Schema;
let  groupsRankSchema = new Schema({
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
    aheadAtHalfLoss: String,
    aheadAtHalfWin: String,
    aheadAtThirdLoss:String,
    aheadAtThirdWin:String,
    behindAtHalfLoss:String,
    behindAtHalfWin:String,
    behindAtThirdLoss:String,
    behindAtThirdWin:String,
    clinched:String,
    confGamesBehind:Number,
    confLoss:Number,
    confRank:Number,
    confWin:Number,
    divGameBehind:Number,
    divLoss:Number,
    divRank:Number,
    divWin:Number,
    fewerTurnoversLoss:String,
    fewerTurnoversWin:String,
    homeLoss:Number,
    homeStreak:String,
    homeWin:Number,
    last10:String,
    last10Home:String,
    last10Road:String,
    leadInFgpctloss:String,
    leadInFgpctwin:String,
    leadInRebLoss:String,
    leadInRebWin:String,
    loseStreak:String,
    losses:Number,
    onHotStreak:String,
    oppover500Loss:String,
    oppover500Win:String,
    oppscore100PlusLoss:String,
    oppscore100PlusWin:String,
    otloss:String,
    otwin:String,
    pointsAgainst:Number,
    pointsDiff:Number,
    pointsFor:Number,
    roadLoss:Number,
    roadStreak:String,
    roadWin:Number,
    score100PlusLoss:String,
    score100PlusWin:String,
    streak:String,
    tenPtsOrMoreLoss:String,
    tenPtsOrMoreWin:String,
    threePtsOrLessLoss:String,
    threePtsOrLessWin:String,
    tiedAtHalfLoss:String,
    tiedAtHalfWin:String,
    tiedAtThirdLoss:String,
    tiedAtThirdWin:String,
    winPct:Number,
    winStreak:String,
    wins:Number
});
let groupsRankModel = mongoose.model('groupsRank', groupsRankSchema);
function setData(data, modal) {
    let target_data = [];
    data.forEach((v, i) => {
        const teams = v.teams;
        teams.forEach((s_v, s_i) => {
            target_data.push(Object.assign({}, s_v.profile ,s_v.standings));
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
        setData(all_data.payload.standingGroups, groupsRankModel)
    })
});

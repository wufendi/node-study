// mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
let http = require('http');
let fs = require('fs');
let db = mongoose.connection;
let groupsName = [];
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
function getLogoData(name) {
    let target_url = `http://china.nba.com/media/img/teams/logos/${name}_logo.svg`;
    http.get(target_url,(res) => {
        let imgData="";
        res.setEncoding("binary");
        res.on("data",(chunk) =>{
            imgData += chunk;
        });
        res.on("end",() => {
            let imgPath=`/${name}.svg`;
            fs.writeFile(__dirname + "/imgs"+imgPath,imgData,"binary",(err) =>{
                if (err) {
                    console.log(err);
                } else {
                   console.log('获取logo成功');
                }
            });
        });
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

groupsModel.find({}, {_id: 0 ,abbr: 1}, (err, data) => {
    console.log(data);
    if (!err) {
        groupsName = data;
        groupsName.forEach((v,i) => {
            getLogoData(v.abbr);
        })
    } else {
        console.log('获取数据失败');
        throw err;
    }
})
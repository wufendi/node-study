// mongoosejs.com/docs/index.html
// 获取球员的具体信息
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const db = mongoose.connection;
const Schema = mongoose.Schema;
let currentModel;
let currentSchema;
let i = 0
currentSchema = new Schema({// http://china.nba.com/static/data/player/stats_alex_abrines.json
    name: String,
}, {collection:'allCountry'});
currentModel = mongoose.model('allCountry', currentSchema);
function getCountry() {
    const $ = cheerio.load('');
    let countryArray = [];
    const countryOption = $('<select class="player-index-header-filter ng-pristine ng-valid ng-touched" name="country-filter" data-ng-model="$parent.country" data-ng-change="onCountrySelect()" data-ng-options="country.display as country.display for country in countries | filter:{value: \'!Non United States\'}" style=""><option label="以国籍筛选" value="string:以国籍筛选" selected="selected">以国籍筛选</option><option label="阿根廷" value="string:阿根廷">阿根廷</option><option label="澳洲" value="string:澳洲">澳洲</option><option label="奥地利" value="string:奥地利">奥地利</option><option label="巴哈马" value="string:巴哈马">巴哈马</option><option label="波斯尼亚和黑塞哥维那" value="string:波斯尼亚和黑塞哥维那">波斯尼亚和黑塞哥维那</option><option label="Bosnia and Herzegovina" value="string:Bosnia and Herzegovina">Bosnia and Herzegovina</option><option label="巴西" value="string:巴西">巴西</option><option label="喀麦隆" value="string:喀麦隆">喀麦隆</option><option label="加拿大" value="string:加拿大">加拿大</option><option label="中国" value="string:中国">中国</option><option label="克罗地亚" value="string:克罗地亚">克罗地亚</option><option label="捷克共和国" value="string:捷克共和国">捷克共和国</option><option label="刚果民主共和国" value="string:刚果民主共和国">刚果民主共和国</option><option label="多明尼加共和国" value="string:多明尼加共和国">多明尼加共和国</option><option label="埃及" value="string:埃及">埃及</option><option label="芬兰" value="string:芬兰">芬兰</option><option label="法国" value="string:法国">法国</option><option label="格鲁吉亚" value="string:格鲁吉亚">格鲁吉亚</option><option label="德国" value="string:德国">德国</option><option label="希腊" value="string:希腊">希腊</option><option label="海地" value="string:海地">海地</option><option label="以色列" value="string:以色列">以色列</option><option label="意大利" value="string:意大利">意大利</option><option label="Japan" value="string:Japan">Japan</option><option label="拉脱维亚" value="string:拉脱维亚">拉脱维亚</option><option label="立陶宛" value="string:立陶宛">立陶宛</option><option label="马里" value="string:马里">马里</option><option label="黑山" value="string:黑山">黑山</option><option label="新西兰" value="string:新西兰">新西兰</option><option label="尼日利亚" value="string:尼日利亚">尼日利亚</option><option label="波兰" value="string:波兰">波兰</option><option label="波多黎各" value="string:波多黎各">波多黎各</option><option label="俄罗斯" value="string:俄罗斯">俄罗斯</option><option label="塞内加尔" value="string:塞内加尔">塞内加尔</option><option label="塞尔维亚" value="string:塞尔维亚">塞尔维亚</option><option label="斯洛文尼亚" value="string:斯洛文尼亚">斯洛文尼亚</option><option label="南苏丹" value="string:南苏丹">南苏丹</option><option label="西班牙" value="string:西班牙">西班牙</option><option label="瑞典" value="string:瑞典">瑞典</option><option label="瑞士" value="string:瑞士">瑞士</option><option label="Trinidad and Tobago" value="string:Trinidad and Tobago">Trinidad and Tobago</option><option label="突尼斯" value="string:突尼斯">突尼斯</option><option label="土耳其" value="string:土耳其">土耳其</option><option label="乌克兰" value="string:乌克兰">乌克兰</option><option label="英国" value="string:英国">英国</option><option label="美国" value="string:美国">美国</option></select>').find('option');
    countryOption.each(function(v) {
        countryArray.push({name: $(this).text()});
    });
    console.log(countryArray);
    return countryArray;
}
function setData() {
    const _data = getCountry();
    _data.shift()
    currentModel.remove(function () {});
    currentModel.create(_data, (err) => {
        if (err) {
            throw err;
        } else {
            console.log('插入成功');
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
setData();
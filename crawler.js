const http = require('http');
const cheerio = require('cheerio');
const url = 'http://china.nba.com/playerindex/';
function handleHtml(html) {
    const $ = cheerio.load(html);
    let countryArray = [];
    const countryOption = $('select[name="country-filter"]').find('option');
    countryOption.each(function(v) {
        countryArray.push($(this).text());
    });
    console.log(countryArray);
}
http.get(url,(res)=> {
    let html = '';
    res.on('data', (data) => {
        html += data;
    });
    res.on('end', () => {
        handleHtml(html);
    })
}).on('error', () => {
    console.log('爬取页面失败');
});
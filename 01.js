// mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/m_data');
// 监听
let db = mongoose.connection;
db.on('error',() => {
    console.log('连接失败')
});
db.once('open', function() {
   console.log('连接成功')
});
db.once('close', function() {
    console.log('断开成功')
});


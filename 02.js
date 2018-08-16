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
let Schema = mongoose.Schema;
let personSchema = new Schema({
    name: String,
    age: Number,
    sex: {
        type: String,
        default: '男'
    },
    chat: String
});
let personModel = mongoose.model('person', personSchema);
personModel.create({
    name: '谢霆锋',
    age: 40,
    chat: '1990哈哈哈'
}, (err) => {
    if (!err) {
        console.log('插入成功')
    } else {
        throw err;
    }
})
personModel.create({
    name: '周杰伦',
    age: 34,
    chat: '杰伦爱奶茶'
}, (err) => {
    if (!err) {
        console.log('插入成功')
    } else {
        throw err;
    }
})
personModel.create({
    name: '赵丽颖',
    age: 34,
    chat: '哈哈哈哈或或',
    sex: '女'
}, (err) => {
    if (!err) {
        console.log('插入成功')
    } else {
        throw err;
    }
})
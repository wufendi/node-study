// mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/m_data');
// 监听
let db = mongoose.connection;
db.once('open', function() {
    console.log('连接成功')
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
/*personModel.create({
    name: '谢霆锋',
    age: 40,
    chat: '1990哈哈哈'
}, (err) => {
    if (!err) {
        console.log('插入成功')
    } else {
        throw err;
    }
})*/
let person = new personModel({
    name: '宋小宝',
    age: 40,
    chat: '我是宋小宝'
});
person.save((err,product) => {
    if (!err) {
        console.log(product);
    } else {
        throw err;
    }
});
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
// personModel.create([
//     {name: '李建', age: 40, chat: '1990哈哈哈'},
//     {name: '庾澄庆', age: 50, chat: '1990哈哈哈'},
//     {name: '那英', age: 51, chat: '1990哈哈哈',sex: '女'},
//     {name: '汪峰', age: 40, chat: '1990哈哈哈'},
//     ], (err) => {
//     if (!err) {
//         console.log('插入成功')
//     } else {
//         throw err;
//     }
// });
// 查
/*
personModel.find({}, (err, docs) => {
    if (!err) {
        console.log(docs);
        console.log(typeof docs);
    }
});
personModel.find({name: '周杰伦'}, (err, docs) => {
    if (!err) {
        console.log(docs);
        console.log(typeof docs);
    }
});
*/
/*
personModel.find({}, {name: 1}, (err, docs) => {
    if (!err) {
        console.log(docs);
        console.log(typeof docs);
    }
});*/
/*
personModel.find({}, {name: 1}, {skip: 2, limit: 2}, (err, docs) => {
    if (!err) {
        console.log(docs);
        console.log(typeof docs);
    }
});
*/
// 修
/*personModel.update({name: '周杰伦'},{$set: {age: 20}}, {multi: true}, (err) => {
    if (!err) {
        console.log('修改成功');
    } else {
        throw err;
    }
});*/
 // 删
/*
Model.remove()
Model.deleteOne()
Model.deleteMany()
 */
/*
personModel.remove({name: '那英'},(err) => {
    if (!err) {
        console.log('删除成功');
    } else {
        throw err;
    }
});*/
// 统计
personModel.count({},(err, count) => {
    if (!err) {
        console.log('count: ' + count)
    } else {
        throw err;
    }
})

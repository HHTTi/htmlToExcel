const express = require('express')
const cors = require("cors")
const qs = require('querystring')
const path = require('path');
const session = require('express-session')
const bodyParser = require('body-parser');

const { url, smiles } = require('./config')

const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const GetHtml = require('./src/getHtml');


// const url = 'http://admet.scbdd.com/calcpre/index_sys_result/'
const name = ['O=C(c1ccccc1O)C=Cc1ccccc1']
// const name = ['O=C(c1ccccc1O)C=Cc1ccccc1','COc1cc(O)cc(c1C(=O)C=Cc1ccccc1)O','O=C(c1ccccc1O)C=Cc1ccccc1','Oc1ccc(cc1)c1[o+]c2cc(O)cc(c2cc1O)O']
var list = smiles.split(/[\s\n]/)


/*引入路由模块*/
// var index = require("./routes/index");

const app = express();

log4js.useLogger(app)

app.use(express.static(path.resolve(__dirname, '../client/public')));
// app.use(express.static(path.resolve(__dirname, './uploadFiles/wework')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'ddddddd',
    resave: false,
    saveUninitialized: true
}));
app.listen(3000, () => {
    console.log('app.listen:3000')
});


// 更新文章列表
app.get('/update_wx_subscription', (req, res) => {


})
// 更新提醒列表
app.get('/update_mp_subscribe_list', (req, res) => {


})

let html = new GetHtml(list, url);
let r = html.init()
console.log('html', html, url, list)


app.post('/form', (req, res) => {
    let data = req.body;
    const { pwd, smiles } = data
    infolog.info('form 表单提交:', data);
    if (!pwd || pwd != '1') {
        res.send({ 'code': 0, 'msg': '参数错误' });
        return;
    };

    try {

        res.send({ 'code': 1, 'msg': result })
    } catch (e) {
        errlog.error('/form--catcherr==>>', e);
        res.send({ 'code': 0, 'msg': '未知错误' });
    }
})
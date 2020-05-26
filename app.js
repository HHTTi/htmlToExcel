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
const ReadExcel = require('./src/readExcel');

const name = ['O=C(c1ccccc1O)C=Cc1ccccc1']
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
app.listen(3001, () => {
    console.log('app.listen:3001')
});

let excel = new ReadExcel(path.join(__dirname, 'public/input/smiles1.xlsx'));

let data = excel.init()

infolog.info('ReadExcel data', data)

let html = new GetHtml(data, url);
let r = html.init()

infolog.info('start GetHtml')




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
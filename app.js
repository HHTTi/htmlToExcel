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
const SplitExcel = require('./src/splitExcel');

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

function start() {
    let outputName = "100_200"
    let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

    let data = excel.init()

    infolog.info('ReadExcel data', data, outputName)

    let html = new GetHtml(data, url);

    infolog.info('start GetHtml')

    html.init()
}

start()

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

app.get('/split_excel', (req, res) => {
    var query = req.query;
    infolog.info('split_excel:', query);
    if (!query) {
        res.send({ 'code': 0, 'msg': '参数错误' });
        return;
    };
    const { openId, blog_id } = query;
    try {
        // let split = new SplitExcel(path.join(__dirname, 'public/input/smiles.xlsx'), 100)

        // split.init()
        res.send({ 'code': 0, 'msg': result })
    } catch (e) {
        errlog.error('split_excel::', e);
        res.send({ 'code': 0, 'msg': '未知错误' });
    }
})
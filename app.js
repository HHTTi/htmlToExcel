// const cors = require("cors")
const path = require('path');

// const { url } = require('./config')

const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const GetHtml = require('./src/getHtml');
const ReadExcel = require('./src/readExcel');
const SplitExcel = require('./src/splitExcel')
const MergeExcel = require('./src/mergeExcel')
const UpdateExcel = require('./src/updateExcel')

const NewHtmlToExcel = require('./src/NewHtmlToExcel')
const NewSplitExcel = require('./src/NewSplitExcel')
const NewGetHtml = require('./src/rule1/getHtml')
const admetsar1 = require('./src/lmmdEcustEdu/admetsar1');
const admetsar2 = require('./src/lmmdEcustEduNew/admetsar2');

const UpdateExcel818 = require('./src/rule2/updateExcel');

// let arr = new NewSplitExcel(path.join(__dirname, `public/input/DRUGBANK_smiles.csv`));

var args = process.argv.splice(2)

if (args[0]) {
    switch (args[0]) {
        case 'admetsarFn':
            admetsarFn()
            break;
        case 'newGetHtmlFn':
            newGetHtmlFn()
            break;
        case 'admetsar2Fn':
            admetsar2Fn()
            break;

    }
}

function admetsarFn() {
    let inputFile = 'public/input/Bis2R3S4S5R6S62S3R4R.xlsx'
    let a = new admetsar1(inputFile);
    a.init()
}

function admetsar2Fn() {
    let inputFile = 'public/excel/admetsar2_2021.01.10.xlsx'
    let a = new admetsar2(inputFile);
}

// let obj = arr.getInitData()

// console.log( arr.getInitData())
function newHtmlToExcel() {
    // inputFile, outputUrl, url, list, index, length
    let inputFile = 'public/input/2.xlsx',
        outputUrl = "public/output/smile_out_2.xlsx",
        url = 'http://admet.scbdd.com/calcpre/index_sys_result/',
        fileIndex = 817;

    let excel = new NewHtmlToExcel(inputFile, outputUrl, url, fileIndex);
    excel.init()
}


function updateExcel818() {
    let input = "public/input/smiles_data_816(已自动还原).xlsx",
        output = "public/output/smiles_data_816(已自动还原)_new.xlsx"
    let excel = new UpdateExcel818(input, output);
    excel.init()
}

// updateExcel818()

// var time = 1;

// obj.list.forEach((item, index) => {

//     setTimeout(() => {
//         let excel = new NewHtmlToExcel('', '', url, item, index, obj.length);
//         excel.loopList();

//     }, time);

//     time += 3000

// })
// let excel = new NewGetHtml()

// excel.init()
function newGetHtmlFn(){
    let inputFile =  "public/excel/6621.xlsx", 
        outputUrl = "public/output/";

    let excel = new NewGetHtml(inputFile,outputUrl)

    excel.init()
}

function start(outputName) {

    let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

    let data = excel.init()

    infolog.info('ReadExcel data', data, outputName)

    let html = new GetHtml(data, url, outputName);

    infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

    html.init()
}

function start1() {
    let outputName = "1_300"
    let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

    let data = excel.init()

    infolog.info('ReadExcel data', data, outputName)

    let html = new GetHtml(data, url, outputName);

    infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

    html.init()
}

// start1()

// start()
// '1_300', '300_600', '600_900', '900_1200', '1200_1500',
// let arr = ['1500_1800', '1800_2100', '2100_2400', '2400_2700', '2700_2815']
// let time = 3000;

// start4()
// setTimeout(() => { start5() }, 15000)
// setTimeout(() => { start6() }, 3000)
// setTimeout(() => { start7() }, 6000)
// setTimeout(() => { start8() }, 9000)
// setTimeout(() => { start9() }, 12000)


function split() {
    let split = new SplitExcel(path.join(__dirname, 'public/input/smiles.xlsx'), 300)
    split.init()
}
// split()

function merge() {

    // '1_300', '300_600', '600_900', '900_1200', '1200_1500',
    let arr = [
        '1_100',
        '100_200',
        '200_300',
        '300_400',
        '400_500',
        '500_600',
        '600_700',
        '700_800',
        '800_900',
        '900_1000',
        '1000_1100',
        '1100_1200',
        '1200_1500',
        '1500_1800',
        '1800_2100',
        '2100_2400',
        '2400_2700',
        '2700_2815'
    ]
    let merge = new MergeExcel(arr)
    merge.init()
}

// merge()

function updateExcel() {
    let update = new UpdateExcel(
        'public/input/smiles_mw.xlsx',
        'public/input/smiles_all_update.xlsx',
        'public/output/smiles_all_update.xlsx'
    )
    update.init()
}

// updateExcel()
const cors = require("cors")
const qs = require('querystring')
const path = require('path');

const { url } = require('./config')

const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const GetHtml = require('./src/getHtml');
const ReadExcel = require('./src/readExcel');
const SplitExcel = require('./src/splitExcel')
const MergeExcel = require('./src/mergeExcel')

const NewSplitExcel = require('./src/NewSplitExcel')
const NewMergeExcel = require('./src/NewMergeExcel')
const NewUpdateExcel = require('./src/NewUpdateExcel')


// let arr = new NewSplitExcel(path.join(__dirname, `public/input/DRUGBANK_smiles.csv`));
// let obj = arr.getInitData()


// new NewMergeExcel().init();




// startNewUpdateExcel
function start(outputName) { new NewUpdateExcel(outputName).init() }
function start1(outputName) { new NewUpdateExcel(outputName).init() }
function start2(outputName) { new NewUpdateExcel(outputName).init() }
function start3(outputName) { new NewUpdateExcel(outputName).init() }
function start4(outputName) { new NewUpdateExcel(outputName).init() }
function start5(outputName) { new NewUpdateExcel(outputName).init() }
function start6(outputName) { new NewUpdateExcel(outputName).init() }
function start7(outputName) { new NewUpdateExcel(outputName).init() }
function start8(outputName) { new NewUpdateExcel(outputName).init() }
function start9(outputName) { new NewUpdateExcel(outputName).init() }
function start10(outputName) { new NewUpdateExcel(outputName).init() }
function start11(outputName) { new NewUpdateExcel(outputName).init() }
function start12(outputName) { new NewUpdateExcel(outputName).init() }
function start13(outputName) { new NewUpdateExcel(outputName).init() }
function start14(outputName) { new NewUpdateExcel(outputName).init() }
function start15(outputName) { new NewUpdateExcel(outputName).init() }
function start16(outputName) { new NewUpdateExcel(outputName).init() }
function start17(outputName) { new NewUpdateExcel(outputName).init() }
function start18(outputName) { new NewUpdateExcel(outputName).init() }
function start19(outputName) { new NewUpdateExcel(outputName).init() }
function start20(outputName) { new NewUpdateExcel(outputName).init() }
function start21(outputName) { new NewUpdateExcel(outputName).init() }
function start22(outputName) { new NewUpdateExcel(outputName).init() }
function start23(outputName) { new NewUpdateExcel(outputName).init() }
function start24(outputName) { new NewUpdateExcel(outputName).init() }
function start25(outputName) { new NewUpdateExcel(outputName).init() }
function start26(outputName) { new NewUpdateExcel(outputName).init() }
function start27(outputName) { new NewUpdateExcel(outputName).init() }



// startGetHtml
// function start(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start1(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start2(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start3(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start4(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start5(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start6(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start7(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start8(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start9(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start10(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start11(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start12(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start13(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start14(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start15(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start16(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start17(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start18(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start19(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start20(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start21(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start22(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start23(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start24(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start25(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start26(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }
// function start27(outputName) { new GetHtml(obj.list[outputName - 1], url, outputName).init() }

function startGetHtml() {
    start1(1)
    setTimeout(() => { start2(2) }, 2000)
    setTimeout(() => { start3(3) }, 4000)
    setTimeout(() => { start4(4) }, 6000)
    setTimeout(() => { start5(5) }, 8000)
    setTimeout(() => { start6(6) }, 10000)
    setTimeout(() => { start7(7) }, 12000)
    setTimeout(() => { start8(8) }, 14000)
    setTimeout(() => { start9(9) }, 16000)
    setTimeout(() => { start10(10) }, 18000)
    setTimeout(() => { start11(11) }, 20000)
    setTimeout(() => { start12(12) }, 22000)
    setTimeout(() => { start13(13) }, 24000)
    setTimeout(() => { start14(14) }, 26000)
    setTimeout(() => { start15(15) }, 28000)
    setTimeout(() => { start16(16) }, 30000)
    setTimeout(() => { start17(17) }, 32000)
    setTimeout(() => { start18(18) }, 34000)
    setTimeout(() => { start19(19) }, 36000)
    setTimeout(() => { start20(20) }, 38000)
    setTimeout(() => { start21(21) }, 40000)
    setTimeout(() => { start22(22) }, 42000)
    setTimeout(() => { start23(23) }, 44000)
    setTimeout(() => { start24(24) }, 46000)
    setTimeout(() => { start25(25) }, 48000)
    // setTimeout(() => { start26(26) }, 50000)/
}

// startGetHtml()


// setTimeout(() => { start27(27) }, 52000)

// setTimeout(() => { start2(2) }, 38000)
// setTimeout(() => { start2(2) }, 40000)
// setTimeout(() => { start2(2) }, 38000)
// setTimeout(() => { start2(2) }, 40000)
// setTimeout(() => { start2(2) }, 38000)
// setTimeout(() => { start2(2) }, 40000)


// for (let i = 1; i < 27; i++) {
//     setTimeout(() => { ['start' + i](i) }, 2000 * i)
//     console.log(typeof ['start' + i])
// }




// function start1() {
//     let outputName = "300_600"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start2() {
//     let outputName = "600_900"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start3() {
//     let outputName = "900_1200"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start4() {
//     let outputName = "1200_1500"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start5() {
//     let outputName = "1500_1800"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start6() {
//     let outputName = "1800_2100"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start7() {
//     let outputName = "2100_2400"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start8() {
//     let outputName = "2400_2700"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }

// function start9() {
//     let outputName = "2700_2815"
//     let excel = new ReadExcel(path.join(__dirname, `public/output/smiles_${outputName}.xlsx`));

//     let data = excel.init()

//     infolog.info('ReadExcel data', data, outputName)

//     let html = new GetHtml(data, url, outputName);

//     infolog.info(`start GetHtml:smiles_${outputName}.xlsx`)

//     html.init()
// }
// start()
// '1_300', '300_600', '600_900', '900_1200', '1200_1500',
// let arr = ['1500_1800', '1800_2100', '2100_2400', '2400_2700', '2700_2815']
// let time = 3000;
// arr.forEach((item) => {
//     console.log(item)
//     setTimeout(() => { start(item) }, time);

//     time += 3000
// })

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
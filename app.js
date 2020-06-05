const cors = require("cors")
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
const UpdateExcel = require('./src/updateExcel')

const NewHtmlToExcel = require('./src/NewHtmlToExcel')

let excel = new NewHtmlToExcel(path.join(__dirname, `public/input/DRUGBANK_smiles.csv`));

excel.getInitData();


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

function updateExcel() {
    let update = new UpdateExcel(
        'public/input/smiles_mw.xlsx',
        'public/input/smiles_all_update.xlsx',
        'public/output/smiles_all_update.xlsx'
    )
    update.init()
}

// updateExcel()
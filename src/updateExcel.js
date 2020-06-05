const fs = require('fs');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');


// 修复 LD50 (LD50 of acute toxicity) /  LogS (Solubility) 没有第二条数据的问题
class UpdateExcel {
    constructor(mwFile, excelFileUrl, outputUrl) {
        this.mwFile = mwFile
        this.excelFileUrl = excelFileUrl
        this.outputUrl = outputUrl
    }

    //修复 LD50 第二条数据 
    init() {
        try {
            var mwData = xlsx.parse(`${this.mwFile}`)[0].data,
                input = xlsx.parse(`${this.excelFileUrl}`),
                data = input[0].data,
                outputUrl = this.outputUrl,
                toDecimal = this.toDecimal,
                ld1 = '',
                ld2 = '',
                mw = 0;

            for (let i = 1; i < data.length; i++) {
                ld1 = data[i][31];
                mw = mwData[Math.floor((i + 1) / 2)][2];
                // if(i % 2 === 0){

                // }

                ld2 = toDecimal(Math.pow(10, -parseFloat(ld1)) * mw * 1000)
                // console.log('name:',data[i][0] ===  mwData[Math.floor((i + 1) / 2)][0],ld1, '---', ld2,'===',mw)

                data[i][31] = ld1.replace('( mg/kg)', `(${ld2}mg/kg)`)

                // console.log('=',data[i][31],'=')
                // return;
            }
            // input[0].data = data;

            var buffer = xlsx.build(
                [{
                    name: 'sheet1',
                    data: data
                }]
            )

            fs.writeFile(outputUrl, buffer, function (err) {
                if (err) {
                    errlog.error(outputUrl, '导出数据:', err)
                } else {
                    infolog.info(`修复 LD50 第二条数据 to '${outputUrl}' done!`);
                }
            })

        } catch (error) {
            errlog.error('修复 LD50 第二条数据', error)
        }
    }

    toDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return null;
        }
        f = Math.round(x * 1000) / 1000;
        return f;
    }

}

// function toDecimal(x) {
//     var f = parseFloat(x);
//     if (isNaN(f)) {
//         return;
//     }
//     f = Math.round(x * 1000) / 1000;
//     return f;
// }
// var logs_1 = $('#logs_1').text();
// var logs_2 = toDecimal(Math.pow(10, logs_1) * 314.293 * 1000);
// $('#logs_2').text(logs_2);

// var ld50_1 = $('#ld50_1').text();
// var ld50_2 = toDecimal(Math.pow(10, -ld50_1) * 314.293 * 1000);
// $('#ld50_2').text(ld50_2);



module.exports = UpdateExcel;
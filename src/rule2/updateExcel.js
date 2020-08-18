const fs = require('fs');
const log4js = require('../middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');


// 更新  LogS (Solubility) 没有第二条数据的问题
class UpdateExcel {
    constructor(excelFileUrl, outputUrl) {
        this.excelFileUrl = excelFileUrl
        this.outputUrl = outputUrl
    }

    //修复 LogS (Solubility) 第二条数据 
    init() {
        try {
            var
                input = xlsx.parse(`${this.excelFileUrl}`),
                data = input[0].data,
                outputUrl = this.outputUrl,
                toDecimal = this.toDecimal,
                logS1 = '',
                logS2 = '',
                mw = 0; //molecularWeight

            data[0].push('LogS (Solubility)')

            for (let i = 1; i < data.length; i++) {
                logS1 = data[i][4];
                mw = data[i][3];
                logS2 = toDecimal(Math.pow(10, parseFloat(logS1)) * Number(mw) * 1000);

                data[i].push(logS2+' μg/mL')
                data[i][4] = logS1.replace(' μg/mL)', `${logS2}μg/mL)`)
            }

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
            errlog.error('修复 LogS 第二条数据', error)
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

module.exports = UpdateExcel;
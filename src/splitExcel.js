const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class SplitExcel {
    constructor(fileUrl, excelLength) {
            this.fileUrl = fileUrl
            this.excelLength = excelLength
            this.excel = [{
                name: 'sheet1',
                data: [
                    [
                        'Name',
                        'SMILES',
                        '序号'
                    ],
                ]
            }]
        }
        //分割excel为小excel
    init() {
        try {
            var excelData = xlsx.parse(this.fileUrl)

            var data = excelData[0].data;
            var newData = this.excel
            var num = 1;

            for (let i = 1; i < data.length; i++) {
                newData[0].data.push(data[i])

                if (i % this.excelLength == 0 || i == data.length - 1) {
                    var buffer = xlsx.build(newData)
                    fs.writeFileSync(`public/output/smiles_${num}_${i}.xlsx`, buffer)

                    num = i;
                    newData = this.excel;

                    infolog.info(`完成分割:smiles_${num}_${i}.xlsx 时间:${new Date().getTime()}`)
                }
            }
            infolog.info('分割excel为小excel done');
        } catch (error) {
            errlog.error('分割excel为小excel', error)
        }
    }



}

module.exports = SplitExcel;
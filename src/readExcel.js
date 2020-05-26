const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class ReadExcel {
    constructor(fileUrl) {
            this.fileUrl = fileUrl

            this.predictedData = [{
                name: 'sheet1',
                data: [
                    [
                        'Name',
                        'SMILES',
                        'Property',
                        'Predicted values'
                    ],
                ]
            }]
            this.probabilityData = [{
                name: 'sheet2',
                data: [
                    [
                        'Name',
                        'SMILES',
                        'Property',
                        'Probability'
                    ],
                ]
            }]
        }
        // 处理excel 生成数组
    init() {
        try {
            var excelData = xlsx.parse(this.fileUrl)

            infolog.info('excelData', excelData[0])

            return excelData[0].data
        } catch (error) {
            errlog.error(error)
        }
    }



}

module.exports = ReadExcel;
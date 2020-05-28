const fs = require('fs');
const axios = require('axios');
const log4js = require('./src/middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class ReadExcel {
    constructor(fileUrl) {
        this.fileUrl = fileUrl
    }

    // 处理excel 生成数组
    init() {
        try {
            var excelData = xlsx.parse(this.fileUrl)

            var data = excelData[0].data;
            var newData = []

            for (let i = 1; i < data.length; i++) {
                newData.push({ name: data[i][0], smiles: data[i][1] })
            }

            infolog.info('newData done');
            return newData;
        } catch (error) {
            errlog.error('处理excel 生成数组', error)
        }
    }



}

module.exports = ReadExcel;
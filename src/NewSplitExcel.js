const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class NewSplitExcel {
    constructor(inputFile, outputUrl, url) {
        this.inputFile = inputFile //输入url
        this.url = url || 'http://admet.scbdd.com/calcpre/index_sys_result/' //请求url
        this.outputUrl = outputUrl //输出文件
        this.n = 100

    }

    // 输入表格 输出为数据
    getInitData() {
        try {

            var excelData = xlsx.parse(this.inputFile),
                data = excelData[0].data,
                newData = [],
                // splitData = this.splitData,
                _this = this;

            for (let i = 0; i < data.length; i++) {
                newData.push({ id: data[i][0], smiles: data[i][1] })
            }

            // splitData.call(_this, newData)
            var n = this.n,
                list = [],
                item = [];


            for (let i = 0; i < newData.length; i++) {
                if (i > 1 && i % n == 0 || i == newData.length - 1) {
                    list.push(item)
                    item = [];
                }
                item.push(newData[i]);

            }
            infolog.info('splitData done 总 ' + newData.length + ' 条数据 分成 ', list.length + ' 份');

            return { list, length: newData.length };
            // return newData;

        } catch (error) {
            errlog.error('处理excel 生成数组', error)
            return null;
        }
    }

    // 切割数据 分为N份
    splitData(data) {
        infolog.info('this.splitData.bind(this, newData)');

        var n = this.n,
            list = [],
            item = [];


        if (!Array.isArray(data)) {
            errlog.error('切割数据 分为N份', data);
            return;
        };

        for (let i = 0; i < data.length; i++) {
            if (i > 1 && i % n == 0 || i == data.length - 1) {
                list.push(item)
                item = [];
            }
            item.push(data[i]);
            // if (i == 51) {
            //     infolog.info('newData done', list);
            //     return;
            // }
        }
        infolog.info('splitData done 总 ' + data.length + ' 条数据 分成 ', list.length + ' 份');

        return { list, length: data.length };
    }

}

module.exports = NewSplitExcel;
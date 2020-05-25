
const path = require('path');
const fe = require('fs-extra');
const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const FormData = require('form-data');
const cheerio = require('cheerio')
const request = require('request');
const qs = require('qs');
const xlsx = require('node-xlsx');


class GetHtml {
    constructor(smilesName, url) {
        this.smilesName = smilesName
        this.url = url
        this.predictedData = [{
            name: 'sheet1',
            data: [
                [
                    'smiles',
                    'Property',
                    'Predicted values'
                ],
            ]
        }]
        this.probabilityData = [{
            name: 'sheet2',
            data: [
                [
                    'smiles',
                    'Property',
                    'Probability'
                ],
            ]
        }]
    }
    // 处理name
    async init() {
        if (Array.isArray(this.smilesName) && this.smilesName.length) {
            var smilesName = this.smilesName,
                url = this.url,
                requestHtml = this.requestHtml,
                writeExcel = this.writeExcel,
                _this = this;

            for (let i = 0; i < smilesName.length; i++) {
                await requestHtml.call(_this, smilesName[i], url)
                if (i == smilesName.length - 1) {
                    await writeExcel.call(_this);
                    infolog.info('smiles init done');
                }
            }


        }
    }

    // 请求html
    async requestHtml(name, url) {
        if (!name && !url) {
            errlog.error('smilesName或url不存在');
            return;
        };
        var processData = this.processData,
            _this = this;

        await axios({
            url: url,
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({ smiles: name }),
        }).then(async (res) => {
            infolog.info('smiles 请求:', res);
            await processData.call(_this, res.data)
        }).catch((e) => {
            errlog.error('smiles 请求:', e);
        });

    }

    // 处理html
    async processData(html) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var smiles = this.smilesName;
        var _this = this;

        var $ = cheerio.load(html);

        $(".table-bordered").each(function (index, item) {
            infolog.info('$(".table-bordered").each', index, item);
            $(this).find('tbody tr').each(function (idx, itm) {
                let one = $(this).children().first().text(),
                    two = $(this).children().eq(1).text(),
                    three = $(this).children().eq(2).text();
                one = one.replace(/[\r\n]/g, "")
                one = one.trim()
                two = two.replace(/[\r\n]/g, "")
                two = two.trim()
                three = three.replace(/[\r\n]/g, "")
                three = three.trim()
                
                _this.predictedData[0].data.push([
                    smiles,
                    one,
                    two
                ])

                _this.probabilityData[0].data.push([
                    smiles,
                    one,
                    three
                ])

            })

        })

        infolog.info('once processData done!');
        return true;
    }

    // 生成excel
    async writeExcel() {
        // if (!predictedData || !probabilityData) {
        //     errlog.error('Fn-writeExcel-predictedData/probabilityData 数据不存在');
        //     return;
        // }

        var predictedDataBuffer = xlsx.build(this.predictedData);
        var probabilityDataBuffer = xlsx.build(this.probabilityData);
        fs.writeFile('public/excel/Predicted_values.xlsx', predictedDataBuffer, function (err) {
            if (err) {
                errlog.error("Write Predicted_values.xlsx failed: " + err);
                return;
            }

            infolog.info("Write Predicted_values.xlsx completed.");
        });
        fs.writeFile('public/excel/Probability.xlsx', probabilityDataBuffer, function (err) {
            if (err) {
                errlog.error("Write Probability.xlsx failed: " + err);
                return;
            }

            infolog.info("Write Probability.xlsx completed.");
        });
        infolog.info(this.predictedData[0].data);
    }

}

module.exports = GetHtml;
const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class GetHtml {
    constructor(smilesName, url, outputName) {
        this.smilesName = smilesName
        this.url = url
        this.outputName = outputName
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

    // 处理name
    async init() {
        if (Array.isArray(this.smilesName) && this.smilesName.length) {
            var smilesName = this.smilesName,
                url = this.url,
                requestHtml = this.requestHtml,
                writeExcel = this.writeExcel,
                outputName = this.outputName,
                _this = this;

            for (let i = 0; i < 1; i++) {
                infolog.info(`${i + 1}/${smilesName.length} (dir:${outputName}) 开始请求(${smilesName[i].name})`);
                await requestHtml.call(_this, smilesName[i], url)
                if (i == smilesName.length - 1) {
                    await writeExcel.call(_this);
                    infolog.info('done!!!');
                }
            }

        }
    }

    // 请求html
    async requestHtml(itemName, url) {
        var { name, smiles } = itemName;
        if (!smiles && !url) {
            errlog.error('smilesName或url不存在', name, smiles);
            return;
        };
        var processData = this.processData,
            errorData = this.errorData,
            _this = this,
            errorSmilesToData = false;

        await axios({
            url: url,
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({ smiles: smiles }),
        }).then(async (res) => {
            infolog.info('请求完成,' + 'smilesName:' + smiles+'==',res.data);
            await processData.call(_this, res.data, name, smiles)
        }).catch((e) => {
            // errlog.error('smiles 请求:', e);
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '',
                headers = e.response ? e.response.headers : '';
            errlog.error(`smilesName(${smiles})请求 status:${status},statusText:${statusText},headers:${headers}`);
            if (!errorSmilesToData) {
                errorData.call(_this, name, smiles);
                errorSmilesToData = true;
            }
        });

    }

    async errorData(name, smiles) {
        this.predictedData[0].data.push([
            name,
            smiles,
            '',
            ''
        ])
        this.probabilityData[0].data.push([
            name,
            smiles,
            '',
            ''
        ])
    }

    // 处理html
    //  数据处理 更新格式 

    async processData(html, name, smiles) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var _this = this;

        var $ = cheerio.load(html);

        $(".table-bordered").each(function (index, item) {

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
                    name,
                    smiles,
                    one,
                    two
                ])

                _this.probabilityData[0].data.push([
                    name,
                    smiles,
                    one,
                    three
                ])


            })

        })

        infolog.info(`化合物${name} 数据处理完成!`);
        return true;
    }

    // 生成excel
    async writeExcel() {
        // if (!predictedData || !probabilityData) {
        //     errlog.error('Fn-writeExcel-predictedData/probabilityData 数据不存在');
        //     return;
        // }
        var outputName = this.outputName;
        var predictedDataBuffer = xlsx.build(this.predictedData);
        var probabilityDataBuffer = xlsx.build(this.probabilityData);

        if (!fs.existsSync('public/excel')) {
            fs.mkdirSync('public/excel');
        }

        fs.writeFile(`public/excel/Predicted_values_${outputName}.xlsx`, predictedDataBuffer, function (err) {
            if (err) {
                errlog.error("Write Predicted_values_" + outputName + ".xlsx failed: " + err);
                return;
            }

            infolog.info("Write Predicted_values_" + outputName + ".xlsx completed.");
        });
        fs.writeFile(`public/excel/Probability_${outputName}.xlsx`, probabilityDataBuffer, function (err) {
            if (err) {
                errlog.error("Write Probability_" + outputName + ".xlsx failed: " + err);
                return;
            }

            infolog.info("Write Probability_" + outputName + ".xlsx completed.");
        });

    }

}

module.exports = GetHtml;
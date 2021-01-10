const fs = require('fs');
const axios = require('axios');
const log4js = require('../middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class admetsar1 {
    constructor(inputFile) {
        this.inputFile = inputFile //输入 
        //请求url?smiles=OCC1OC%28Oc2ccc%28cc2%29C%3DCC%28%3DO%29c2ccc%28cc2O%29O%29C%28C%28C1O%29O%29O&action=A
        this.url = 'http://lmmd.ecust.edu.cn/admetsar1/predict/'
        this.excel = [{
            name: 'sheet1',
            data: [
                [
                    'CID',
                    'Compound',
                    'CanonicalSMILES',

                    'Human Ether-a-go-go-Related Gene Inhibition',
                    'AMES Toxicity',
                    'Carcinogens',
                    'Fish Toxicity',
                    'Tetrahymena Pyriformis Toxicity',
                    'Honey Bee Toxicity',
                    'Biodegradation',
                    'Acute Oral Toxicity',
                    'Carcinogenicity (Three-class)',

                    'Aqueous solubility (LogS)',
                    'Caco-2 Permeability (LogPapp, cm/s)',
                    'Rat Acute Toxicity (LD50, mol/kg)',
                    'Fish Toxicity (pLC50, mg/L)',
                    'Tetrahymena Pyriformis Toxicity (pIGC50, ug/L)',
                ]
            ]
        }]
    }

    // 处理name
    async init() {
        var excelData = xlsx.parse(this.inputFile)

        var data = excelData[0].data;

        var requestHtml = this.requestHtml,
            _this = this;

        for (let i = 1; i < data.length; i++) {

            infolog.info(`第${i}/${data.length}个请求(${data[i][0]})smiles:(${data[i][1]})`);

            await requestHtml.call(_this, data[i])
            if (i === data.length - 1) {
                infolog.info('done!!!');
            }
        }

    }

    // 请求html
    async requestHtml(item) {
        var name = item[1],
            smiles = item[2].trim(),
            id = item[0];

        if (!smiles) {
            errlog.error('smiles不存在', id, smiles);
            return;
        };
        var processData = this.processData,
            errorData = this.errorData,
            url = this.url + `?smiles=${encodeURI(smiles)}&action=A`,
            _this = this,
            errorSmilesToData = false;

        await axios({
            url: url,
            method: 'GET',
            // headers: { 'content-type': 'application/x-www-form-urlencoded' },
            // data: qs.stringify({ smiles: smiles }),
        }).then(async (res) => {
            infolog.info('-- 请求完成,id: ' + id);
            await processData.call(_this, res.data, name, id, smiles)

        }).catch((e) => {
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '',
                headers = e.response ? e.response.headers : '';
            errlog.error(`smilesName(${smiles})请求 status:${status},statusText:${statusText},headers:${headers}`);
            if (!errorSmilesToData) {
                errorData.call(_this, name, id, smiles);
                errorSmilesToData = true;
            }
        });

    }

    async errorData(name, id, smiles) {
        var arr1 = [
            name,
            id,
            smiles,
        ];
           
        this.writeExcel(arr1)
    }

    // 处理html
    async processData(html, name, id, smiles) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var arr1 = [name, id, smiles],
            _this = this,
            container,
            hasData = false,
            dataNo = 0,
            writeExcel = this.writeExcel,
            $ = cheerio.load(html);

        $("#container .maintable .content >  table.compound_profile").each(function (index, item) {
            if(index === 0) {
                $(item).find('tr').each(function (idx, itm) {
                    if(hasData) {
                        arr1.push($(this).find("a").text());
                    }
                    if($(this).children("td").text() === "Toxicity") {
                        hasData = true;
                    }
                })

            } else if(index === 1) {
                $(item).find('tr').each(function (idx, itm) {
                    if(idx === 2 || idx === 3 || idx >= 8) {
                        arr1.push($(this).find("a").text());
                    }
                    
                })
            }
        })

        writeExcel.call(_this, arr1)
        infolog.info(`化合物${name} 数据处理完成!`);
        // return true;
    }

    // 生成excel
    async writeExcel(arr1) {

        var fileUrl = `public/excel/admetsar1_smiles_data_.xlsx`,
            excel;

        if (!fs.existsSync('public/excel')) {
            fs.mkdirSync('public/excel');
        }
        if (!fs.existsSync(fileUrl)) {

            var buffer = xlsx.build(this.excel);

            fs.writeFileSync(fileUrl, buffer);
        }

        excel = xlsx.parse(`public/excel/admetsar1_smiles_data_.xlsx`);

        excel[0].data.push(arr1)

        fs.writeFile(fileUrl, xlsx.build(excel), function (err) {
            if (err) {
                errlog.error("Write " + fileUrl + " failed: " + err);
                return;
            }

            // infolog.info("Write " + arr1[0] + " completed.");
        });

    }
}

module.exports = admetsar1;
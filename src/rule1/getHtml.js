const fs = require('fs');
const axios = require('axios');
const log4js = require('../middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class NewGetHtml {
    constructor(inputFile, outputUrl, url, list, index, length) {
        this.inputFile = inputFile || 'public/input/2.xlsx'
        this.url = url || 'http://admet.scbdd.com/calcpre/calc_rules_single_mol/' //请求url
        this.outputUrl = outputUrl || 'public/excel/new3.xlsx'   //输出文件

        this.n = 100

        this.list = list
        this.index = index
        this.length = length

        this.excel = [{
            name: 'sheet1',
            data: [
                [
                    'Name',
                    'CID',
                    'Canonical_SMILES',
                    'Hydrogen bond donor',
                    'Hydrogen bond acceptor',
                    'Matches',
                    'Molecular weight',
                ]
            ]
        }]
    }


    async init() {
        var excelData = xlsx.parse(this.inputFile)

        var data = excelData[0].data;

        var requestHtml = this.requestHtml,
            _this = this;

        for (let i = 1; i < data.length; i++) {

            infolog.info(`${i + 1}/${data.length} 开始请求(${data[i][0]})smiles:(${data[i][1]})`);

            await requestHtml.call(_this, data[i])
            if (i == data.length - 1) {
                // await writeExcel.call(_this);
                infolog.info('done!!!');
            }
            // return;
        }

    }

    // 请求html
    async requestHtml(item) {
        // var { id, smiles } = item;
        var name = item[0],
            smiles = item[2],
            id = item[1];

        if (!smiles) {
            errlog.error('smiles不存在', name, smiles);
            return;
        };
        var processData = this.processData,
            errorData = this.errorData,
            url = this.url,
            _this = this,
            errorSmilesToData = false;

        await axios({
            url: url,
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({ smiles: smiles, property: 'rule1' }),
        }).then(async (res) => {
            infolog.info('序号(' + id + ')请求完成,name:{{' + name + '}}');
            await processData.call(_this, res.data, name, smiles, id)

        }).catch((e) => {
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '',
                headers = e.response ? e.response.headers : '';
            errlog.error(`smilesName(${smiles})请求 status:${status},statusText:${statusText}`);
            if (!errorSmilesToData) {
                errorData.call(_this, name, smiles, id);
                errorSmilesToData = true;
            }
        });

    }

    async errorData(name, smiles, id) {
        var arr1 = [
            name,
            id,
            smiles,
            '',
            '',
            '',
            '',
        ]
        this.writeExcel(arr1)
    }

    // 处理html
    async processData(html, name, smiles, id) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var arr1 = [name, id, smiles],
            _this = this,
            writeExcel = this.writeExcel,
            $ = cheerio.load(html);

        var mw = $("#sample_1 tbody tr:first-child td:nth-child(2)").text(),
            donor = $("#sample_1 tbody tr:first-child td:nth-child(3)").text(),
            acceptor = $("#sample_1 tbody tr:first-child td:nth-child(4)").text(),
            matches = $("#sample_1 tbody tr:first-child td:nth-child(6)").text();

        acceptor = acceptor.replace(/[\r\n]/g, "")
        acceptor = acceptor.trim()
        matches = matches.replace(/[\r\n]/g, "")
        matches = matches.trim()

        // console.log('donor, acceptor, matches, mw', donor, acceptor, matches, mw)
        arr1.push(donor, acceptor, matches, mw)


        writeExcel.call(_this, arr1)
        infolog.info(`化合物${name} 数据处理完成!`);
        // return true;
    }

    // 生成excel
    async writeExcel(arr1) {

        var fileUrl = this.outputUrl,
            excel;

        if (!fs.existsSync('public/excel')) {
            fs.mkdirSync('public/excel');
        }
        if (!fs.existsSync(fileUrl)) {

            var buffer = xlsx.build(this.excel);

            fs.writeFileSync(fileUrl, buffer);
        }

        excel = xlsx.parse(fileUrl);

        excel[0].data.push(arr1)

        fs.writeFile(fileUrl, xlsx.build(excel), function (err) {
            if (err) {
                errlog.error("Write " + fileUrl + " failed: " + err);
                return;
            }

            infolog.info("Write " + arr1[0] + " completed.");
        });

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

module.exports = NewGetHtml;
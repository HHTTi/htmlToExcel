const fs = require('fs-extra');
const axios = require('axios');
const log4js = require('../middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');
const path = require('path');

class NewGetHtml {
    constructor(inputFile, outputUrl, url) {
        this.inputFile = inputFile || 'public/input/2.xlsx'
        this.url = url || 'http://admet.scbdd.com/calcpre/calc_rules_single_mol/' //请求url
        this.outputUrl = outputUrl || 'public/excel/new3.xlsx'   //输出文件
        this.successData = [
            [
                'Name',
                'CID',
                'Canonical_SMILES',
                'Hydrogen bond donor',
                'Hydrogen bond acceptor',
                "LogP",
                'Matches',
                'Molecular weight',
            ]
        ];
        this.errorData = [
            [
                'Name',
                'CID',
                'Canonical_SMILES',
                'Hydrogen bond donor',
                'Hydrogen bond acceptor',
                "LogP",
                'Matches',
                'Molecular weight',
            ]
        ];
        this.baseData = [
            [
                'Name',
                'CID',
                'Canonical_SMILES',
                'Hydrogen bond donor',
                'Hydrogen bond acceptor',
                "LogP",
                'Matches',
                'Molecular weight',
            ]
        ]
    }

    async init() {

        var data = xlsx.parse(this.inputFile)[0].data,
            requestHtml = this.requestHtml,
            _this = this;

        for (let i = 1; i < data.length; i++) {
            let isEnd = false;
            if (i === data.length - 1) {
                isEnd = true;
            }
            infolog.info(`${i + 1}/${data.length} (${data[i][1]})开始请求`);

            await requestHtml.call(_this, data[i], isEnd)
        }

    }

    // 请求html
    async requestHtml(item, isEnd) {
        var name = item[2],
            smiles = item[0],
            id = item[1];

        if (!smiles) {
            errlog.error('smiles不存在', name, smiles);
            return;
        };
        var processData = this.processData,
            url = this.url,
            _this = this;

        await axios({
            url: url,
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({ smiles: smiles, property: 'rule1' }),
        }).then(async (res) => {
            infolog.info('     (' + id + ')请求完成');
            await processData.call(_this, res.data, name, smiles, id, isEnd)

        }).catch((e) => {
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '';

            errlog.error(`ID:(${id})请求 status:${status},statusText:${statusText}`);
            _this.errorData.push([name, id, smiles])
            _this.baseData.push([name, id, smiles])
            if (isEnd) {
                _this.writeExcel()
            }

        });

    }

    // 处理html
    async processData(html, name, smiles, id, isEnd) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var _this = this,
            $ = cheerio.load(html);

        var mw = $("#sample_1 tbody tr:first-child td:nth-child(2)").text(),
            donor = $("#sample_1 tbody tr:first-child td:nth-child(3)").text(),
            acceptor = $("#sample_1 tbody tr:first-child td:nth-child(4)").text(),
            logP = $("#sample_1 tbody tr:first-child td:nth-child(5)").text(),
            matches = $("#sample_1 tbody tr:first-child td:nth-child(6)").text();

        acceptor = acceptor.replace(/[\r\n]/g, "")
        acceptor = acceptor.trim()
        matches = matches.replace(/[\r\n]/g, "")
        matches = matches.trim()

        _this.successData.push([name, id, smiles, donor, acceptor, logP, matches, mw])
        _this.baseData.push([name, id, smiles, donor, acceptor, logP, matches, mw]);

        if (isEnd) {
            _this.writeExcel()
        }
    }

    // 生成excel
    writeExcel() {
        fs.ensureDirSync(this.outputUrl);

        let file = path.join(this.outputUrl, '6621_数据结果.xlsx');
        let newData = [
            { name: '所有数据', data: this.baseData },
            { name: '请求成功', data: this.successData },
            { name: '请求失败', data: this.errorData },
        ]

        fs.writeFile(file, xlsx.build(newData), function (err) {
            if (err) {
                errlog.error("Write " + '6621_数据结果' + " failed: " + err);
                return;
            }
            infolog.info("Write " + '6621_数据结果' + " completed.");
        });

    }
}

module.exports = NewGetHtml;
const fs = require('fs');
const fse = require('fs-extra');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const axios = require('axios');
const cheerio = require('cheerio')
const qs = require('qs');


// 修复  数据 502 的问题
class NewUpdateExcel {
    constructor(file) {
        this.file = file
        this.url = 'http://admet.scbdd.com/calcpre/index_sys_result/' //请求url
        this.i = 0;
    }

    async init() {
        try {
            var file = this.file,
                requestHtml = this.requestHtml,
                input = `public/excel`,
                output = `public/output`,
                data = xlsx.parse(`public/excel/smiles_data_${file}.xlsx`),
                d = data[0].data,
                id = '',
                smiles = '',
                _this = this;


            fse.ensureDirSync(input);
            fse.ensureDirSync(output);

            for (let i = 1; i < d.length; i++) {
                if (i % 2 == 1 && !d[i][6]) {
                    id = d[i][0];
                    smiles = d[i][1];
                    this.i = i;

                    infolog.info(`(${i + 1}/${d.length} 开始请求id:(${id}) smiles:(${smiles})`);
                    await requestHtml.call(_this, { id, smiles })
                    if (i == d.length - 1) {
                        // await writeExcel.call(_this);
                        infolog.info('done!!!');
                    }
                }
            }

        } catch (error) {
            errlog.error('修复 数据 502 的问题', error)
        }
    }

    // 请求html
    async requestHtml(item) {
        var { id, smiles } = item;
        if (!smiles) {
            errlog.error('smiles不存在', id, smiles);
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
            data: qs.stringify({ smiles: smiles }),
        }).then(async (res) => {
            infolog.info('-- 请求完成,id: ' + id);
            await processData.call(_this, res.data, id, smiles)

        }).catch((e) => {
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '',
                headers = e.response ? e.response.headers : '';
            errlog.error(`id:(${id})smilesName(${smiles})请求 status:${status},statusText:${statusText}`);
            if (!errorSmilesToData) {
                // errorData.call(_this, id, smiles);
                errorSmilesToData = true;
            }
        });

    }

    async errorData(id, smiles) {
        var arr1 = [
            id,
            smiles,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        ],
            arr2 = [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            ]
        this.writeExcel(arr1, arr2)
    }

    // 处理html
    async processData(html, name, smiles) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var arr1 = [name, smiles],
            arr2 = ['', ''],
            logP,
            hbAcceptor,
            hbDonor,
            tpsa,
            logs_1,
            logs_2,
            ld50_1,
            ld50_2,
            ld2,
            molecularWeight,
            _this = this,
            toDecimal = this.toDecimal,
            writeExcel = this.writeExcel,
            $ = cheerio.load(html);

        molecularWeight = $("#q_mw").text();
        logP = $("#q_logp").text();
        hbAcceptor = $("#q_hacc").text();
        hbDonor = $("#q_hdon").text();
        tpsa = $("#q_tpsa").text();

        logs_1 = $('#logs_1').text();
        logs_2 = toDecimal(Math.pow(10, logs_1) * Number(molecularWeight) * 1000);
        $('#logs_2').text(logs_2);

        ld50_1 = $('#ld50_1').text();
        ld50_2 = toDecimal(Math.pow(10, -ld50_1) * Number(molecularWeight) * 1000);
        $('#ld50_2').text(ld50_2);


        arr1.push(logP, hbAcceptor, hbDonor, tpsa, 'Predicted values');
        arr2.push('', '', '', '', 'Probability');

        $(".table-bordered").each(function (index, item) {

            $(this).find('tbody tr').each(function (idx, itm) {
                // let one = $(this).children().first().text(),
                let two = $(this).children().eq(1).text(),
                    three = $(this).children().eq(2).text();
                // one = one.replace(/[\r\n]/g, "")
                // one = one.trim()
                two = two.replace(/[\r\n]/g, "")
                two = two.trim()
                three = three.replace(/[\r\n]/g, "")
                three = three.trim()

                arr1.push(two)

                if (index == 1 || index == 2 || index == 3 || index == 5) {
                    arr2.push(three)
                } else {
                    arr2.push('')
                }
            })

        })
        arr1.push(molecularWeight);
        arr2.push('')

        writeExcel.call(_this, arr1, arr2)
        infolog.info(`化合物${name} 数据处理完成!`);
        // return true;
    }

    // 生成excel
    async writeExcel(arr1, arr2) {

        var i = this.i,
            file = this.file,
            fileUrl = `public/excel/smiles_data_${file}.xlsx`,
            excel = xlsx.parse(fileUrl);

        if (i) {
            excel[0].data[i] = arr1;
            excel[0].data[i + 1] = arr2;
        }

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

module.exports = NewUpdateExcel;
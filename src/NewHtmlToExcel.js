const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class NewHtmlToExcel {
    constructor(inputFile, url, fileIndex) {
        this.inputFile = inputFile //输入url
        this.url = url || 'http://admet.scbdd.com/calcpre/index_sys_result/' //请求url
        this.fileIndex = fileIndex

        this.excel = [{
            name: 'sheet1',
            data: [
                [
                    'Molecule',
                    'CID',
                    'Compound',
                    'Canonical SMILES',
                    'Log P (Crippen method)',
                    'HB Acceptor',
                    'HB Donor',
                    'TPSA',
                    '',
                    'LogS (Solubility)',
                    'LogD7.4 (Distribution Coefficient D)',
                    'LogP (Distribution Coefficient P)',
                    'Papp (Caco-2 Permeability)',
                    'Pgp-inhibitor',
                    'Pgp-substrate',
                    'HIA (Human Intestinal Absorption)',
                    'F (20% Bioavailability)',
                    'F (30% Bioavailability)',
                    'PPB (Plasma Protein Binding)',
                    'VD (Volume Distribution)',
                    'BBB (Blood–Brain Barrier)',
                    'P450 CYP1A2 inhibitor',
                    'P450 CYP1A2 Substrate',
                    'P450 CYP3A4 inhibitor',
                    'P450 CYP3A4 substrate',
                    'P450 CYP2C9 inhibitor',
                    'P450 CYP2C9 substrate',
                    'P450 CYP2C19 inhibitor',
                    'P450 CYP2C19 substrate',
                    'P450 CYP2D6 inhibitor',
                    'P450 CYP2D6 substrate',
                    'T 1/2 (Half Life Time)',
                    'CL (Clearance Rate)',
                    'hERG (hERG Blockers)',
                    'H-HT (Human Hepatotoxicity)',
                    'AMES (Ames Mutagenicity)',
                    'SkinSen (Skin sensitization)',
                    'LD50 (LD50 of acute toxicity)',
                    'DILI (Drug Induced Liver Injury)',
                    'FDAMDD (Maximum Recommended Daily Dose)',
                    'Molecular Weight'
                ]
            ]
        }]

    }

    // 处理name
    async init() {
        var excelData = xlsx.parse(this.inputFile)

        var data = excelData[this.fileIndex].data;

        var requestHtml = this.requestHtml,
            _this = this;

        if (!fs.existsSync('public/excel')) {
            fs.mkdirSync('public/excel');
        }

        for (let i = 1; i < data.length; i++) {

            infolog.info(`${i}/${data.length} 开始请求(${data[i][0]})`);

            await requestHtml.call(_this, data[i], this.fileIndex)
            if (i == data.length - 1) {
                infolog.info('done!!!');
            }
            // return;
        }

    }

    // 请求html
    async requestHtml(item, fileIndex) {
        var name = item[2],
            molecule = item[0],
            smiles = item[3],
            id = item[1];

        // console.log(item);
        // return;
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
            // infolog.info('-- 请求完成,id: ' + id);
            await processData.call(_this, res.data, name, id, smiles, fileIndex,molecule)

        }).catch((e) => {
            console.log(e)
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '',
                headers = e.response ? e.response.headers : '';
            errlog.error(`smilesName(${smiles})请求 status:${status},statusText:${statusText},headers:${headers}`);
            if (!errorSmilesToData) {
                errorData.call(_this, fileIndex, name, id, smiles,molecule);
                errorSmilesToData = true;
            }
        });

    }

    async errorData(fileIndex, name, id, smiles,molecule) {
        var arr1 = [
            molecule,
            id,
            name,
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
                '',
                ''
            ]
        this.writeExcel(fileIndex, arr1, arr2)
    }

    // 处理html
    async processData(html, name, id, smiles, fileIndex,molecule) {
        if (!html) {
            errlog.error('Fn-processData-html不存在');
            return false;
        };
        var arr1 = [molecule, id, name, smiles],
            arr2 = ['', '', '',''],
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

        writeExcel.call(_this, fileIndex, arr1, arr2)
        // infolog.info(`化合物${name} 数据处理完成!`);
        // return true;
    }

    // 生成excel
    async writeExcel(fileIndex, arr1, arr2) {

        var fileUrl = `public/excel/smile_ADME_lab_${fileIndex}_2021_01_25.xlsx`,
            excel;

        if (!fs.existsSync(fileUrl)) {

            var buffer = xlsx.build(this.excel);

            fs.writeFileSync(fileUrl, buffer);
        }

        excel = xlsx.parse(fileUrl);

        excel[0].data.push(arr1, arr2)

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

module.exports = NewHtmlToExcel;
const fs = require('fs');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class NewHtmlToExcel {
    constructor(inputFile, outputUrl, url, list, index, length) {
        this.inputFile = inputFile //输入url
        this.url = url || 'http://admet.scbdd.com/calcpre/index_sys_result/' //请求url
        this.outputUrl = outputUrl //输出文件
        this.n = 100

        this.list = list
        this.index = index
        this.length = length

        this.excel = [{
            name: 'sheet1',
            data: [
                [
                    'Id',
                    'SMILES',
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

    // // 输入表格 输出为数据
    // getInitData() {
    //     try {

    //         var excelData = xlsx.parse(this.inputFile),
    //             data = excelData[0].data,
    //             newData = [],
    //             splitData = this.splitData,
    //             _this = this;

    //         for (let i = 1; i < data.length; i++) {
    //             newData.push({ id: data[i][0], smiles: data[i][1] })
    //         }

    //         splitData.call(_this, newData)
    //         // return newData;

    //     } catch (error) {
    //         errlog.error('处理excel 生成数组', error)
    //         // return null;
    //     }
    // }

    // // 切割数据 分为N份
    // splitData(data) {
    //     infolog.info('this.splitData.bind(this, newData)');

    //     var n = this.n,
    //         loopList = this.loopList,
    //         list = [],
    //         item = [];


    //     if (!Array.isArray(data)) {
    //         errlog.error('切割数据 分为N份', data);
    //         return;
    //     };

    //     for (let i = 0; i < data.length; i++) {
    //         if (i > 1 && i % n == 0 || i == data.length - 1) {
    //             list.push(item)
    //             item = [];
    //         }
    //         item.push(data[i]);
    //         // if (i == 51) {
    //         //     infolog.info('newData done', list);
    //         //     return;
    //         // }
    //     }
    //     infolog.info('splitData done 总 ' + data.length + ' 条数据 分成 ', list.length + ' 份');

    //     loopList.call(this, list, data.length);
    // }

    // 循环请求
    loopList() {
        var list = this.list,
            length = this.length,
            index = this.index,
            n = this.n,
            requestHtml = this.requestHtml,
            _this = this;
        

        list.forEach(async (itm, idx) => {

            infolog.info(`${index * n + idx}/${length} 开始请求,id: ${itm.id};`);

            // await requestHtml.call(_this, itm, index)

            
        })
    }


    // 请求html
    async requestHtml(item, fileIndex) {
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
            await processData.call(_this, res.data, id, smiles, fileIndex)

        }).catch((e) => {
            let status = e.response ? e.response.status : '',
                statusText = e.response ? e.response.statusText : '',
                headers = e.response ? e.response.headers : '';
            errlog.error(`smilesName(${smiles})请求 status:${status},statusText:${statusText},headers:${headers}`);
            if (!errorSmilesToData) {
                errorData.call(_this, fileIndex, id, smiles);
                errorSmilesToData = true;
            }
        });

    }

    async errorData(fileIndex, id, smiles) {
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
        this.writeExcel(fileIndex, arr1, arr2)
    }

    // 处理html
    async processData(html, name, smiles, fileIndex) {
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

                if (index == 0 && idx == 0) {
                    ld2 = toDecimal(Math.pow(10, logs_1) * molecularWeight * 1000);
                    two = two.replace('( mg/kg)', `(${ld2}mg/kg)`);
                }
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

        writeExcel(fileIndex, arr1, arr2)
        infolog.info(`化合物${name} 数据处理完成!`);
        // return true;
    }

    // 生成excel
    async writeExcel(fileIndex, arr1, arr2) {

        var fileUrl = `public/excel/smiles_data_${fileIndex}.xlsx`,
            excel;

        if (!fs.existsSync('public/excel')) {
            fs.mkdirSync('public/excel');
        }
        if (!fs.existsSync(fileUrl)) {

            var buffer = xlsx.build(this.excel);

            fs.writeFileSync(fileUrl, buffer);
        }

        excel = xlsx.parse(`public/excel/smiles_data_${fileIndex}.xlsx`);

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
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


    // 将data数据拆成两个文件
    splitExcel() {
        var input = `public/excel/smiles_data.xlsx`,
            output = ``,
            excelData = xlsx.parse(input),
            data = excelData[0].data,
            newData = [{
                name: 'Predicted values',
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
            }],
            newData2 = [{
                name: 'Probability',
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
            }],
            arr1 = [],
            arr2 = [],
            dataItem = [],
            _this = this;


        for (let i = 1; i < data.length; i++) {
            if (i % 2 == 1) {
                // console.log(data[i])
                arr1.push(data[i])
            } else {
                dataItem = data[i - 1].slice(0, 6)
                data[i].splice(0, 6, ...dataItem)

                arr2.push(data[i])
            }
        }
        newData[0].data.push(...arr1);
        newData2[0].data.push(...arr2);

        fs.writeFile('public/excel/smiles_data_Predicted_values.xlsx', xlsx.build(newData), function (err) {
            if (err) {
                errlog.error("Write " + 'smiles_data_Predicted_values' + " failed: " + err);
                return;
            }

            infolog.info("Write " + 'smiles_data_Predicted_values' + " completed.");
        });

        fs.writeFile('public/excel/smiles_data_Probability.xlsx', xlsx.build(newData2), function (err) {
            if (err) {
                errlog.error("Write " + 'smiles_data_Probability' + " failed: " + err);
                return;
            }

            infolog.info("Write " + ' smiles_data_Predicted_values' + " completed.");
        });


    }


}

module.exports = NewSplitExcel;
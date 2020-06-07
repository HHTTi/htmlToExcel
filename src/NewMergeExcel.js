const fs = require('fs');
const fse = require('fs-extra');
const axios = require('axios');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const cheerio = require('cheerio')
const qs = require('qs');
const xlsx = require('node-xlsx');


class NewMergeExcel {
    constructor(inputFile, outputUrl, url) {
        this.inputFile = inputFile //输入url
        this.url = url || 'http://admet.scbdd.com/calcpre/index_sys_result/' //请求url
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

    //合并小excel
    init() {
        try {
            var input = `public/excel`,
                output = `public/output`,
                length = 25,
                excel = this.excel,
                newData = [],
                d;

            fse.ensureDirSync(input);
            fse.ensureDirSync(output);

            for (let i = 0; i < length; i++) {
                d = xlsx.parse(`public/excel/smiles_data_${i + 1}.xlsx`)[0].data;

                for (let j = 1; j < d.length; j++) {
                    newData.push(d[j])
                }

            }
            excel[0].data.push(...newData)


            fs.writeFile(`public/output/smiles_data_all.xlsx`, xlsx.build(excel), function (err) {
                if (err) {
                    errlog.error('smiles_data_all', err)
                } else {
                    infolog.info(`合并excel to 'smiles_data_all.xlsx' done!`);
                }
            })
            return;

        } catch (error) {
            errlog.error('合并excel', error)
        }
    }

}

module.exports = NewMergeExcel;
const fs = require('fs');
const log4js = require('./src/middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');

class ChangeExcel {
    constructor(excelFileUrl, outputUrl) {
        this.excelFileUrl = excelFileUrl
        this.outputUrl = outputUrl
        this.excel = [{
            name: 'sheet1',
            data: [
                [
                    'Name',
                    'SMILES',
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
                ]
            ]
        }]
    }

    //change excel 格式
    init() {
        try {
            var input = xlsx.parse(`${this.excelFileUrl}`)[0].data,
                row = [],
                outputUrl = this.outputUrl;
            // input.forEach((item,i) => {
            // })
            for (let i = 1; i < input.length; i++) {
                if ((i - 1) % 31 == 0) {
                    if (row.length > 0) {
                        this.excel[0].data.push(row)
                    }
                    row = [];
                    row.push(input[i][0])
                    row.push(input[i][1])
                    row.push('')
                }
                row.push(input[i][3])
            }
            var buffer = xlsx.build(this.excel)

            fs.writeFile(outputUrl, buffer, function (err) {
                if (err) {
                    errlog.error(outputUrl, 'change excel:', err)
                } else {
                    infolog.info(`合并excel to '${outputUrl}' done!`);
                }
            })

        } catch (error) {
            errlog.error('change excel 格式', error)
        }
    }


}

module.exports = ChangeExcel;
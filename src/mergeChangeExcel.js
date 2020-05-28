const fs = require('fs');
const log4js = require('./src/middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');

class MergeChangeExcel {
    constructor(predicted_values, probability, outputUrl) {
        this.predicted_values = predicted_values
        this.probability = probability
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

    // 合并 change excel 格式
    init() {
        try {
            var predicted_values = xlsx.parse(`${this.predicted_values}`)[0].data,
                probability = xlsx.parse(`${this.probability}`)[0].data,
                outputUrl = this.outputUrl;


            // input.forEach((item,i) => {
            // })
            for (let i = 1; i < predicted_values.length; i++) {

                predicted_values[i][2] = 'Predicted values';
                probability[i][2] = 'Probability';

                this.excel[0].data.push(predicted_values[i])
                this.excel[0].data.push(probability[i])

            }

            var buffer = xlsx.build(this.excel)

            fs.writeFile(outputUrl, buffer, function (err) {
                if (err) {
                    errlog.error(outputUrl, 'MergeChangeExcel:', err)
                } else {
                    infolog.info(`MergeChangeExcel to '${outputUrl}' done!`);
                }
            })

        } catch (error) {
            errlog.error('MergeChangeExcel', error)
        }
    }


}

module.exports = MergeChangeExcel;
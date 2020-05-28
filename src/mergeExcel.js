const fs = require('fs');
const log4js = require('./src/middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');

class MergeExcel {
    constructor(excelFileList) {
        this.excelFileList = excelFileList
        this.predicted_values = [{
            name: 'sheet1',
            data: [
                [
                    'Name',
                    'SMILES',
                    'Property',
                    'Predicted values'
                ],
            ]
        }]
        this.probability = [{
            name: 'sheet1',
            data: [
                [
                    'Name',
                    'SMILES',
                    'Property',
                    'Probability'
                ],
            ]
        }]
    }

    //合并小excel
    init() {
        try {
            var predicted_values = this.predicted_values,
                probability = this.probability;


            if (Array.isArray(this.excelFileList) && this.excelFileList.length > 0) {
                this.excelFileList.forEach(item => {
                    let predictedData = xlsx.parse(`public/excel/Predicted_values_${item}.xlsx`);
                    let probabilitydData = xlsx.parse(`public/excel/Probability_${item}.xlsx`);

                    predictedData[0].data.splice(0, 1);
                    let data1 = predictedData[0].data
                    predicted_values[0].data.push(...data1)
                    // for (let i = 1; i < predictedData.length; i++) {
                    //     predicted_values[0].data.push(predictedData[i])
                    // }
                    probabilitydData[0].data.splice(0, 1);
                    let data2 = probabilitydData[0].data;
                    probability[0].data.push(...data2)
                    // for (let j = 1; j < probabilitydData.length; j++) {
                    //     probability[0].data.push(probabilitydData[i])
                    // }

                })
                var predicted_valuesBuffer = xlsx.build(predicted_values)
                var probabilityBuffer = xlsx.build(probability)

                fs.writeFile(`public/output/smiles_predicted_values.xlsx`, predicted_valuesBuffer, function (err) {
                    if (err) {
                        errlog.error('smiles_predicted_values', err)
                    } else {
                        infolog.info(`合并excel to 'smiles_predicted_values.xlsx' done!`);
                    }
                })
                fs.writeFile(`public/output/smiles_probability.xlsx`, probabilityBuffer, function (err) {
                    if (err) {
                        errlog.error('smiles_probability', err)
                    } else {
                        infolog.info(`合并excel to 'smiles_probability.xlsx' done!`);
                    }
                })
            }
        } catch (error) {
            errlog.error('合并小excel', error)
        }
    }



}

module.exports = MergeExcel;
const fs = require('fs');
const log4js = require('./middleware/logger')
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




            }
        } catch (error) {
            errlog.error('合并小excel', error)
        }
    }



}

module.exports = MergeExcel;
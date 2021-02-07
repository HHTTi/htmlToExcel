const fse = require('fs-extra');
const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const path = require('path');


class NewMergeExcel {
    constructor(input, output,getFileName,length) {
        this.input = input
        this.output = output
        this.getFileName = getFileName
        this.length = length
        this.init()
    }

    //合并小excel
    init() {
        try {
            var input = this.input,
                output = this.output,
                excel,
                d;

            fse.ensureDirSync(input);
            fse.ensureFileSync(output);

            excel = xlsx.parse(path.join(input,this.getFileName(0)));

            for (let i = 1; i < this.length; i++) {

                d = xlsx.parse(path.join(input,this.getFileName(i)))[0].data.slice(1);

                excel[0].data.push(...d)
            }

            fse.writeFile(output, xlsx.build(excel), function (err) {
                if (err) {
                    errlog.error('smiles_data_all', err)
                } else {
                    infolog.info(`合并excel to '${output}' done!`);
                }
            })
            return;

        } catch (error) {
            errlog.error('合并excel', error)
        }
    }

}

module.exports = NewMergeExcel;
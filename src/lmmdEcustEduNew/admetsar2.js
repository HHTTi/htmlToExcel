const fs = require('fs');
const axios = require('axios');
const log4js = require('../middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');


class admetsar2 {
    constructor(inputFile) {
        this.inputFile = inputFile //输入 
        /**
         * 1.请求 http://lmmd.ecust.edu.cn/admetsar2 获得 任务编号
         * 2.请求 http://lmmd.ecust.edu.cn/admetsar2/result/?tid=274398&type=check 获得数据状态 （服务器是否完成） 返回true才执行第三步
         * 2.请求 http://lmmd.ecust.edu.cn/admetsar2/result/?tid=274398&type=compound 获得数据
        */
        this.url = 'http://lmmd.ecust.edu.cn/admetsar2/result/'
        this.stepOneUrl = 'http://lmmd.ecust.edu.cn/admetsar2/result/'
      
        this.excel = [{
            name: '成功',
            data: [
                [
                    'Molecule',
                    'Compound',
                    'Canonical SMILES',
                    "Molecular Weight","AlogP","H-Bond Acceptor","H-Bond Donor","Rotatable Bonds","Applicability Domain","Human Intestinal Absorption","Caco-2","Blood Brain Barrier","Human oral bioavailability","Subcellular localzation","OATP2B1 inhibitior","OATP1B1 inhibitior","OATP1B3 inhibitior","MATE1 inhibitior","OCT2 inhibitior","BSEP inhibitior","P-glycoprotein inhibitior","P-glycoprotein substrate","CYP3A4 substrate","CYP2C9 substrate","CYP2D6 substrate","CYP3A4 inhibition","CYP2C9 inhibition","CYP2C19 inhibition","CYP2D6 inhibition","CYP1A2 inhibition","CYP inhibitory promiscuity","UGT catelyzed","Carcinogenicity (binary)","Carcinogenicity (trinary)","Eye corrosion","Eye irritation","Ames mutagenesis","Human either-a-go-go inhibition","micronuclear","Hepatotoxicity","Acute Oral Toxicity (c)","Estrogen receptor binding","Androgen receptor binding","Thyroid receptor binding","Glucocorticoid receptor binding","Aromatase binding","PPAR gamma","Honey bee toxicity","Biodegradation","crustacea aquatic toxicity","Fish aquatic toxicity","Water solubility","Plasma protein binding","Acute Oral Toxicity","Tetrahymena pyriformis"
                ]
            ]
        },
        {
            name: '失败',
            data: [
                [
                    'Molecule',
                    'Compound',
                    'Canonical SMILES',
                ]
            ]
        }]
        this.init()
    }

    // 处理name
    async init() {
        try {
            var excelData = xlsx.parse(this.inputFile)
            var data = excelData[0].data;

            var stepOne = this.stepOne,
                timeFn = this.timeFn,
                stepTwo = this.stepTwo,
                url = this.url,
                _this = this;

            var fileUrl = `public/excel/admetsar2_smiles_data_20210110.xlsx`;

            if (!fs.existsSync('public/excel')) {
                fs.mkdirSync('public/excel');
            }

            for (let i = 1; i < data.length; i++) {
                var name = data[i][1],
                    smiles = data[i][2].trim(),
                    id = data[i][0];
    
                if (!smiles) {
                    errlog.error('smiles不存在', id);
                    return; 
                };
                infolog.info(`第${i}/${data.length}个请求 Compound:{{${name}}}`);
    
                let one = await stepOne(url, smiles)


                if(one.data.error) {
                    this.excel[0].data.push(data[i])
                    this.excel[1].data.push(data[i])
                } else if(one.data.result) {
                    let tid = one.data.result;
                    for(let j = 0;j<100;j++) {
                        let two =  await stepTwo(url,tid)
                        if(two.data) {
                            await timeFn()
                            let three = await axios({url: url+ '?tid='+ tid +'&type=compound',method: 'GET'})
                            if(three.data) {
                                const {predictions,profiles,regressions} = three.data;
                                let d = [ id, name,smiles]
                                Array.isArray(profiles.compound1) && profiles.compound1.forEach((e,i) => {i!=5 && d.push(e.value)});
                                Array.isArray(predictions.compound1) && predictions.compound1.forEach(e => {d.push(e.value)});
                                Array.isArray(regressions.compound1) && regressions.compound1.forEach(e => {d.push(e.value)});
                                this.excel[0].data.push(d)

                                fs.writeFile(fileUrl, xlsx.build(this.excel), function (err) {
                                    if (err) {
                                        errlog.error("Write " + name + " failed: " + err);
                                    }else {
                                        infolog.info(`化合物${name} 数据处理完成!`);
                                    }
                                });
                            }else {
                                this.excel[0].data.push(data[i])
                                this.excel[1].data.push(data[i])
                            }
                            break;
                        }else if(j == 99) {
                            this.excel[0].data.push(data[i])
                            this.excel[1].data.push(data[i])
                        }
                    }
                } 
            }
        } catch (e) {
            errlog.error(e);
        }
    }

    stepOne(url,smiles){
        return axios({
            url,
            method: 'POST',
            // headers: {
            //     "Cache-Control": "no-cache",
            //     "Cookie": "Hm_lvt_77064d3e635202d58edcc73eac766eed=1610279594,1610282758,1610283575,1610284439; Hm_lpvt_77064d3e635202d58edcc73eac766eed=1610284439",
            //     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
            //     "X-Requested-With": "XMLHttpRequest"
            //   },
            data:JSON.stringify({smis:[smiles],endpoints:'all'}),
        })
    }

    stepTwo(url,tid){
        return axios({
            url:url + '?tid='+ tid +'&type=check',
            method: 'GET',
        })
    }

    timeFn() {
        return new Promise(resolve => {
            setTimeout(() => { resolve(true) }, 1000)
        })
    }

}

module.exports = admetsar2;

import readXlsxFile from 'read-excel-file/node';
import axiosx from 'axios';
const axios = axiosx.default;
import fs from 'fs';

/// PARAMETERS ///
let start = 1;
let end = 3;
let output = "ecuador.txt";
let url = "http://internal-alb-unete-v3-ppr-315365694.us-east-1.elb.amazonaws.com:3002/keynua/resolveContract";
/// PARAMETERS ///



const stream = fs.createWriteStream(output, { flags: 'a' });
let promises = [];
readXlsxFile("Contratos.xlsx").then((rows) => {
  let newA = rows.slice(start, end);
  let log = [];
 
  newA.forEach((element) => {
    let item = {
      iso: element[6],
      documentType: element[7],
      documentNumber: element[1],
    };

    console.log(item);
    
    promises.push (axios.post(url, item).then(res => {
        console.log(res.data);
        stream.write(item.iso + "," + item.documentType + "," + item.documentNumber + "," + res.data.success + ","  + res.data.message + "\n");

        }).catch(err => {
          console.log(err);
            stream.write(item.iso + "," + item.documentType + "," + item.documentNumber + "," + "error" + ","  + err.code + "\n");
        } ))

  });
});

//await all the promises to end of stream






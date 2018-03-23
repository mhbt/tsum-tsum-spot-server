import conf from '../conf/conf';
import fs from 'fs';
module.exports.log = (message)=> {
    if (!conf.debug) return;
    let date = new Date;
    let error = { time: date.toUTCString(), log: message };
    console.log(message);
    fs.writeFile("./debug.json",JSON.stringify(error) , 'utf8', (err)=>{
        if(err) console.log(err);
    });

}
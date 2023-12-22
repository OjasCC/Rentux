import fs from "fs";

export default function handler(req, res) { //sends Data according to the request to the front end
  try{
    try{req.body=JSON.parse(req.body);}catch{}

    if(req.method!='POST')
     return res.end();

    if(fs.existsSync(`${process.env.DATA_DIR}/${req.body.category.toLowerCase()}.json`))
      res.json(JSON.parse(fs.readFileSync(`${process.env.DATA_DIR}/${req.body.category.toLowerCase()}.json`)));
    
    else
    res.json({valid:0});
  }catch{res.send({valid:0})}
}
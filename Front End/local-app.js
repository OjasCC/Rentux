require('dotenv').config()

const fs= require('fs');
const express=require('express');
const { existsSync,readFile } = require('fs');
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./convert.js');

app.get('/', (req, res) => { //returns index page on /
    res.sendFile(`index.html`, { root: `./${process.env.CONVERT_FOLDER}` });
});

app.get('/:id', (req, res) => { //instead of creating a get() for every page, this get() sends non unique pages by :id
    
    let dir = `${req.params.id}.html`;
    if (existsSync(`./${process.env.CONVERT_FOLDER}/${dir}`))
        res.sendFile(dir, { root: `./${process.env.CONVERT_FOLDER}` });
    else
        res.status(404).sendFile(`404.html`, { root: `./${process.env.CONVERT_FOLDER}` });
});

app.post('/front',async (req,res)=>{ //sends dummy data

    if(fs.existsSync(`${process.env.DATA_DIR}/${req.body.category.toLowerCase()}.json`)){
        res.json(JSON.parse(fs.readFileSync(`${process.env.DATA_DIR}/${req.body.category.toLowerCase()}.json`)));
    }
    else
    res.json({valid:0});
});
 
app.use((err, req, res, next) => { //404 route
    return res.status(404).sendFile(`404.html`, { root: `./${process.env.CONVERT_FOLDER}` })
});

app.listen(process.env.PORT,()=>{
    console.log(`listening at ${process.env.PORT} ...`);
});

import jwt from 'jsonwebtoken';
import fs from "fs";

const git = require('simple-git')();

async function git_commit(req){ //commits all data changes to Github
  
  let git_repo=git.cwd({ path: process.env.GIT_DIR });
  await git_repo.add('./*');
  await git_repo.commit(`Changed on ${new Date(new Date().getTime() + (330 + new Date().getTimezoneOffset())*60000)} from IP:${req.headers['x-forwarded-for'] || req.socket.remoteAddress || null}`);
  await git_repo.push();
  // console.log('commited change!');
}

function del_item(ID){  //deletes item of ID from database

  let _all=JSON.parse(fs.readFileSync(`${process.env.GIT_DIR}/_all.json`, 'utf8')); //returns _all.json data
  let path_cat=`${process.env.DATA_DIR}/${_all['items'][ID]['category']}.json`; // gives path to <category>.json
  let _cat_obj=JSON.parse(fs.readFileSync(path_cat, 'utf8')); //returns <category>.json file object

  if(Object.keys(_cat_obj).length==1 && _all['items'][ID]['category']!=='others'){ //after deleting the item, if the <category>.json is empty then delete it as well

    fs.unlinkSync(path_cat); //deletes empty category file

    let _categories=JSON.parse(fs.readFileSync(`${process.env.GIT_DIR}/_categories.json`, 'utf8'));// reads _categories.json object
    _categories['categories'].splice(_categories['categories'].indexOf(_all['items'][ID]['category']), 1); //removes empty category
    fs.writeFileSync(`${process.env.GIT_DIR}/_categories.json`,JSON.stringify(_categories)); //writes to _categories.json
  }

  delete _all['items'][ID]; //removes item from _all
  delete _cat_obj[ID]; //removes from _cat_obj

  fs.writeFileSync(`${process.env.GIT_DIR}/_all.json`,JSON.stringify(_all)); //writes changes to _all.json
  fs.writeFileSync(path_cat,JSON.stringify(_cat_obj));   //writes changes to <category>.json

}

function add_item(item_data,customID=-1){ //adds item to database if(customID==-1) then assigns latest ID

  let _all=JSON.parse(fs.readFileSync(`${process.env.GIT_DIR}/_all.json`, 'utf8')); //returns _all.json data
  let path_cat=`${process.env.DATA_DIR}/${item_data['category']}.json`; // gives path to <category>.json
  let _cat_obj={};

  if(fs.existsSync(path_cat))
    _cat_obj=JSON.parse(fs.readFileSync(path_cat, 'utf8')); //returns <category>.json file object

  else{ //if the category does not exist then it creates and adds it
    let _categories=JSON.parse(fs.readFileSync(`${process.env.GIT_DIR}/_categories.json`, 'utf8'));// returns _categories object
    _categories['categories'].push(item_data['category']); //adds 'others' category
    fs.writeFileSync(`${process.env.GIT_DIR}/_categories.json`,JSON.stringify(_categories));
  }

  if(customID==-1)
    customID=`ID${++_all['lastID']}`;

  _all['items'][customID]=item_data; //adds data to _all
  _cat_obj[customID]=item_data; //adds data to <category>.json

  fs.writeFileSync(`${process.env.GIT_DIR}/_all.json`,JSON.stringify(_all)); //writes changes to _all.json
  fs.writeFileSync(path_cat,JSON.stringify(_cat_obj));   //writes changes to <category>.json

  return _all['lastID'];
}

function del_pending(UD){ //deletes pending item of given UD
    let _pending=JSON.parse(fs.readFileSync(`${process.env.GIT_DIR}/_pending.json`, 'utf8'));
    console.log(UD);
    delete _pending['items'][UD];
    fs.writeFileSync(`${process.env.GIT_DIR}/_pending.json`,JSON.stringify(_pending));
}

function is_json_valid(JSON_obj){ //checks if json value is valid
  try {
    if (JSON_obj && typeof JSON_obj === "object") 
      return true;
    else
      return false;
  }catch{return false;}

}

export default function handler(req, res) {

  req.body=JSON.parse(req.body);
  if(!is_json_valid(req.body))
    return res.json({valid:0});

  if(req.method!='POST')
    return res.end();

  try {
    jwt.verify(req.body.token,process.env.JWTKEY,(err)=>{ //verifies the JWT token authenticity of request
        if(err){
            res.json({valid:0});
            return;
        }
        else if(req.body.type==='item'){ //sends back data of a single item
          let data=fs.readFileSync(`${process.env.GIT_DIR}/${req.body.from}.json`, 'utf8');
          data=JSON.parse(data);
          res.json({valid:1,item:JSON.stringify(data['items'][req.body.ID])});
        }
        else if(req.body.type==='modify item'){ //saves changes made to an item

          let ID=Object.keys(req.body.JSON_data)[0]; //gets the ID (which was sent with the request) of the item that has been modified

          del_item(ID);
          add_item(req.body.JSON_data[ID],ID);
    
          return res.json({valid:1}); //returns all good
            
        }
        else if(req.body.type==='approve pending'){ //modifies and approves pending item
          
          del_pending(req.body.UD);
          add_item(req.body.JSON_data);
          
          return res.json({valid:1});
          
        }
        else if(req.body.type==='delete pending'){ //modifies and removes a pending item

          del_pending(req.body.JSON_data.UD);
          return res.json({valid:1});
          
        }
        else if(req.body.type==='delete item'){

          del_item(req.body.JSON_data.ID);
          return res.json({valid:1});
          
        }
        else if(req.body.type==='add item'){

          let VALID_JSON =req.body;

          let new_item={ //creates default item
            "img_link": "",
            "title": VALID_JSON['item_name'],
            "info": "",
            "originalcost": "",
            "price": {
            "monthly": 0,
            "monthly_sale": 0,
            "weekly": 0,
            "weekly_sale": 0
            },
            "category": "others",
            "outofstock": 0,
            "owner":"Untitled",
            "email":"Unknown@Untitled.com",
            "phno":"-",
            "refurl":"https://blank.org",
            "age":"0",
            "specs":""
          }

          let lastID=add_item(new_item);
          
          return res.json({valid:1,lastID});
          
        }
        else if(req.body.type==='summon'){ //sends back the data to the Admin page

          let JSON_value=fs.readFileSync(`${process.env.GIT_DIR}/_all.json`, 'utf8');
          JSON_value=JSON.parse(JSON_value);

          let data={'pairs':{}};
          data['lastID']=JSON_value['lastID'];

          for(let key in JSON_value['items'])
            data['pairs'][key]=JSON_value['items'][key]['title'];

          JSON_value=fs.readFileSync(`${process.env.GIT_DIR}/_categories.json`, 'utf8');
          JSON_value=JSON.parse(JSON_value);

          data['categories']=JSON_value['categories'];

          res.json({valid:1,data:JSON.stringify(data)}); //data={ pairs:{},categories,lastID}
        }
        else if(req.body.type==='pending'){ //sends pending the data to the Admin page
          let JSON_value=fs.readFileSync(`${process.env.GIT_DIR}/_pending.json`, 'utf8');
          JSON_value=JSON.parse(JSON_value);

          let data={'pairs':{}}
          for(let key in JSON_value['items'])
            data['pairs'][key]=JSON_value['items'][key]['title'];

          JSON_value=fs.readFileSync(`${process.env.GIT_DIR}/_categories.json`, 'utf8');
          JSON_value=JSON.parse(JSON_value);

          data['categories']=JSON_value['categories'];

          res.json({valid:1,data:JSON.stringify(data)});
        }
        else if(req.body.type==='backup'){ //backsup all files to github
          git_commit(req);
          return res.json({valid:1});
        }
        else
          res.json({valid:0});
    });
  }
  catch (err) {
    console.log(err)
    return res.json({valid:0});
  }
}
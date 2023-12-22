import fs from "fs";

export default function handler(req, res) { // adds enlist item sent to _pending

  if(req.method!='POST')
    return res.end();

  try {
      let VALID_JSON =JSON.parse(req.body);

      if (VALID_JSON && typeof VALID_JSON === "object") { //checks if JSON data sent with request is same

        let temp=JSON.parse(fs.readFileSync(`${process.env.GIT_DIR}/_pending.json`, 'utf8'));
        let UD=`UD${++temp['lastUD']}`;

        temp['items'][UD]={ //creates default item
          "img_link": VALID_JSON['image'],
          "title": VALID_JSON['product'],
          "info": VALID_JSON['descrip'][0]=='None'?'':`${VALID_JSON['descrip'][0]}: ${VALID_JSON['descrip'][1]}`,
          "originalcost": VALID_JSON['cost'],
          "price": {
          "monthly": 0,
          "monthly_sale": 0,
          "weekly": 0,
          "weekly_sale": 0
          },
          "category": "others",
          "outofstock": 0,
          "owner":VALID_JSON['name'],
          "email":VALID_JSON['email'],
          "phno":VALID_JSON['phno'],
          "refurl":VALID_JSON['similar'],
          "age":VALID_JSON['age'],
          "specs":VALID_JSON['additional']
        }

        fs.writeFileSync(`${process.env.GIT_DIR}/_pending.json`,JSON.stringify(temp));

        return res.json({valid:1});
      }
  }
  catch (err) {
  console.log(err)
  return res.json({valid:0});
  }
  
}
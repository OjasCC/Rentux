import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    req.body=JSON.parse(req.body);

    if(req.body.type=='token'){ //verifies the token sent by the request
        jwt.verify(req.body.token,process.env.JWTKEY,(err)=>{
            if(err){
                res.json({valid:0});
                return;
            }
            res.json({valid:1});
        });
    }
    else if(req.body.pass===process.env.PASSWORD||req.body.pass===process.env.MASTERPASSWORD){ //checks if request password is valid
        let token = jwt.sign({ valid: 1 },process.env.JWTKEY,{ expiresIn: '1h' });
        res.json({valid:1,token});
    }
    else
        res.json({valid:0});
      
}

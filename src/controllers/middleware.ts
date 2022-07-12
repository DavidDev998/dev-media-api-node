import database from '../db/db'
import userType from '../models/user'
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

const TOKEN_KEY = process.env.TOKEN_KEY

const middleware = (req:any,res:any,next:any) => {
    const token = req.headers.authorization ? req.headers.authorization.substr(7) : "";
    if(!token){
        res.status(401).send('Não autorizado')
        return
    }
    jwt.verify(token,TOKEN_KEY,function(err:any,decode:any){
        if(err){
            if(err.name === 'TokenExpiredError'){
                res.status(401).send('Token expirado')
                return
            }
            res.status(401).send(err.message)
            return
        }else{
            req.user_id = decode.user_id
            next()
        }
    })
}

export default middleware
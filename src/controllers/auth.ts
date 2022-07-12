const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const TOKEN_KEY = process.env.TOKEN_KEY

import database from '../db/db'
import userType from '../models/user'

const SQL_LOGIN = `SELECT id,name,email,password,salt,createdAt,updatedAt FROM users WHERE email = ?`

var salt = bcrypt.genSaltSync(10);

const auth = {
    login: (user:userType,callback:(user:userType) => void) => {
        const params = [user.email]
        database.get(SQL_LOGIN,params,(_err,row) => {
            if(_err){
                console.log(_err)
            }
            if(row){
                const givenPass = bcrypt.hashSync(user.password, row.salt);
                if(givenPass === row.password){
                    const token = jwt.sign(
                        {
                            user_id:row.id,email:row.email
                        },
                        TOKEN_KEY,
                        {
                            expiresIn: '1h'
                        }
                    )
                    row.token = token
                    delete row.password 
                    delete row.salt 
                }
                
            }
            callback(row)
        })
    }
}

export default auth;
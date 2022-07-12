var jwt = require('jsonwebtoken');

const TOKEN_KEY = process.env.TOKEN_KEY

const decoder = (token:string) => {
    const user = jwt.verify(token,TOKEN_KEY,function(err:any,decode:any){
        if(err){
            return false
        }else{
            return decode
        }
    })
}

export default decoder
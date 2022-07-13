import database from '../db/db'
import userType from '../models/user'
const bcrypt = require('bcrypt')

const SQL_CREATE_USER = `INSERT INTO Users (name, email, password, salt, createdAt,updatedAt) VALUES (?,?,?,?,?,?)`;
const SQL_GET_USERS = `SELECT id,name,email,createdAt,updatedAt FROM users`;
const SQL_GET_ONE_USER = `SELECT id,name,email,password,createdAt,updatedAt FROM users`;
const SQL_GET_ONE_USER_BY_EMAIL = `SELECT id,name,email,createdAt,updatedAt FROM users`;
const SQL_UPDATE_USER = `UPDATE users SET name = ?, email = ? WHERE id = ? AND removed = 0 OR removed IS NULL`;
const SQL_DELETE_USER = `UPDATE users SET removed = 1 WHERE id = ?`;

var salt = bcrypt.genSaltSync(10);

const usersTransactions = {
    register : (user: userType, callback: (id?: number) => void) => {
            database.get(SQL_GET_ONE_USER_BY_EMAIL, user.email, (_err, row) => {
                if(row){
                    callback(undefined)
                }else{
                    const params = [user.name,user.email,bcrypt.hashSync(user.password,salt),salt,Date.now(),Date.now()]
                    database.run(SQL_CREATE_USER, params, function(_err) {
                        callback(this?.lastID)
                    })
                }
            })
    },
    readAll: (callback: (users: userType[]) => void) => {
        const params: any[] = []
        database.all(SQL_GET_USERS, params, (_err, rows) => callback(rows))
    },
    readOne: (id: number, callback: (user?: userType) => void) => {
        const params = [id]
        database.get(SQL_GET_ONE_USER, params, (_err, row) => callback(row))
    },
    readByEmail: (email: string, callback: (users?: userType) => void) => {
        database.get(SQL_GET_ONE_USER_BY_EMAIL, email, (_err, row) => callback(row))
    },
    update: (id: number, user: userType, callback: (notFound: boolean) => void) => {
        const params = [user.name, user.email, id]
        database.run(SQL_UPDATE_USER, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    delete: (id: number, callback: (notFound: boolean) => void) => {
        //TODO: apenas admin pode excluir user
        const params = [id]
        database.run(SQL_DELETE_USER, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    
    
}

export default usersTransactions
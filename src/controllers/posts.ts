import database from '../db/db'
import postType from '../models/post'

const SQL_CREATE_POST = `INSERT INTO posts (title,description,user_id) VALUES (?,?,?)`;
const SQL_GET_POST = `SELECT id,title,description,image FROM posts`;
const SQL_GET_ONE_POST = `SELECT id,title,description,image FROM posts WHERE id = ?`;
const SQL_UPDATE_POST = `UPDATE posts SET title = ?, description = ? WHERE id = ?`;
const SQL_DELETE_POST = `DELETE FROM posts WHERE id = ?`;

const SQL_INSERT_IMAGE = `UPDATE posts SET image = ? WHERE id = ?`;

const usersTransactions = {
    createPost : (post: postType, callback: (id?: number) => void) => {
            const params = [post.title,post.description,post.user_id]
            database.run(SQL_CREATE_POST, params, function(_err) {
                console.log(_err);
                callback(this?.lastID)
            })
    },
    readAll: (callback: (post: postType[]) => void) => {
        const params: any[] = []
        database.all(SQL_GET_POST, params, (_err, rows) => callback(rows))
    },
    readOne: (id: number, callback: (post?: postType) => void) => {
        const params = [id]
        database.get(SQL_GET_ONE_POST, params, (_err, row) => callback(row))
    },
    update: (id: number, post: postType, user_email:string ,callback: (notFound: boolean) => void) => {
        const params = [post.title, post.description,id]
        database.run(SQL_UPDATE_POST, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    insertImage: (id: number, image: string, callback: (notFound: boolean) => void) => {
        const params = [image,id]
        database.run(SQL_INSERT_IMAGE, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    delete: (id: number, user_email:string ,callback: (notFound: boolean) => void) => {
        const params = [id]
        database.run(SQL_DELETE_POST, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    
    
}

export default usersTransactions
import database from '../db/db'
import commentType from '../models/comment'

const SQL_CREATE_COMMENT = `INSERT INTO comments (description,user_id,post_id) VALUES (?,?,?)`;
const SQL_GET_COMMENT = `SELECT id,description,user_id,post_id FROM comments`;
const SQL_GET_ONE_COMMENT = `SELECT id,description,user_id,post_id FROM comments WHERE id = ?`;
const SQL_UPDATE_COMMENT = `UPDATE comments SET description = ? WHERE id = ?`;
const SQL_DELETE_COMMENT = `DELETE FROM comments WHERE id = ?`;

const usersTransactions = {
    createPost : (comment: commentType, callback: (id?: number) => void) => {
            const params = [comment.description,comment.user_id,comment.post_id]
            database.run(SQL_CREATE_COMMENT, params, function(_err) {
                console.log(_err);
                callback(this?.lastID)
            })
    },
    readAll: (callback: (comment: commentType[]) => void) => {
        const params: any[] = []
        database.all(SQL_GET_COMMENT, params, (_err, rows) => callback(rows))
    },
    readOne: (id: number, callback: (comment?: commentType) => void) => {
        const params = [id]
        database.get(SQL_GET_ONE_COMMENT, params, (_err, row) => callback(row))
    },
    update: (id: number, comment: commentType, callback: (notFound: boolean) => void) => {
        const params = [comment.description,id]
        database.run(SQL_UPDATE_COMMENT, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    delete: (id: number, callback: (notFound: boolean) => void) => {
        const params = [id]
        database.run(SQL_DELETE_COMMENT, params, function(_err) {
            callback(this.changes === 0)
        })
    },
    
    
}

export default usersTransactions
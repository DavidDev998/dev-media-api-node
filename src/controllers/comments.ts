import database from '../db/db'
import commentType from '../models/comment'
import postDb from './posts'

const SQL_CREATE_COMMENT = `INSERT INTO comments (description,user_id,post_id) VALUES (?,?,?)`;
const SQL_GET_COMMENT = `SELECT id,description,user_id,post_id FROM comments WHERE removed = 0 OR removed IS NULL`;
const SQL_GET_ONE_COMMENT = `SELECT id,description,user_id,post_id FROM comments WHERE id = ? AND (removed = 0 OR removed IS NULL)`;
const SQL_UPDATE_COMMENT = `UPDATE comments SET description = ? WHERE id = ? AND removed = 0 OR removed IS NULL`;
const SQL_DELETE_COMMENT = `UPDATE comments SET removed = 1,removedBy = ? WHERE id = ?`;

const usersTransactions = {
    createPost : (comment: commentType, callback: (id?: number) => void) => {
            const params = [comment.description,comment.user_id,comment.post_id]
            postDb.readOne(comment.post_id,(post)=>{
                if(post){
                    database.run(SQL_CREATE_COMMENT, params, function(_err) {
                        callback(this?.lastID)
                    })
                }else{
                    callback(undefined)
                }
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
        database.get(SQL_GET_ONE_COMMENT, id, (_err, row) => {
            if(row){
                if(row.user_id === comment.user_id){
                    const params = [comment.description,id]
                    database.run(SQL_UPDATE_COMMENT, params, function(_err) {
                        callback(this.changes === 0)
                    })
                }else{
                    callback(true)
                }
            }
        })
    },
    delete: (id: number,user_id:number ,callback: (notFound: boolean) => void) => {
        database.get(SQL_GET_ONE_COMMENT, id, (_err, row) => {
            if(row){
                postDb.readOne(row.post_id,(post)=>{
                    //Criador do post ou do comentário podem excluir
                    if((post && post.user_id === user_id) || row.user_id === user_id){
                        const params = [(post?.user_id === user_id ? "postOwner" : "commentOwner"),id]
                        database.run(SQL_DELETE_COMMENT, params, function(_err) {
                            callback(this.changes === 0)
                        })
                    }else{
                        callback(true)
                    }
                })
            }
        })
    },
    
    
}

export default usersTransactions
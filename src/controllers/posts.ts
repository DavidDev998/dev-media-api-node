import database from '../db/db'
import postType from '../models/post'

const SQL_CREATE_POST = `INSERT INTO posts (title,description,user_id,createdAt,updatedAt) VALUES (?,?,?,?,?)`;
const SQL_GET_POST = `SELECT id,title,description,image,user_id,views,(SELECT COUNT(*) FROM likes WHERE likes.post_id=posts.id)  as likes, (SELECT COUNT(*) FROM unlikes WHERE unlikes.post_id=posts.id)  as unlikes, (SELECT COUNT(*) FROM comments WHERE comments.post_id=posts.id) as comments  FROM posts WHERE (removed == 0 OR removed IS NULL)`;
const SQL_GET_ONE_POST = `SELECT id,title,description,image,user_id,views,(SELECT COUNT(*) FROM likes WHERE likes.post_id=posts.id)  as likes, (SELECT COUNT(*) FROM unlikes WHERE unlikes.post_id=posts.id)  as unlikes, (SELECT COUNT(*) FROM comments WHERE comments.post_id=posts.id) as comments FROM posts WHERE id = ? AND (removed == 0 OR removed IS NULL)`;
const SQL_UPDATE_POST = `UPDATE posts SET title = ?, description = ? WHERE id = ? AND removed = 0 OR removed IS NULL`;
const SQL_DELETE_POST = `UPDATE posts SET removed = 1 WHERE id = ?`;

const SQL_INCREMENT_VIEW = `UPDATE posts SET views = ? WHERE id = ?`
const SQL_INCREMENT_LIKE = `INSERT INTO likes (post_id,user_id,createdAt) VALUES (?,?,?)`
const SQL_INCREMENT_UNLINE = `INSERT INTO unlikes (post_id,user_id,createdAt) VALUES (?,?,?)`

const SQL_INSERT_HISTORIC = `INSERT INTO postsHistoric (post_id,title,description,image,createdAt) VALUES (?,?,?,?,?)`;

const SQL_INSERT_IMAGE = `UPDATE posts SET image = ? WHERE id = ? AND removed = 0 OR removed IS NULL`;

const usersTransactions = {
    createPost : (post: postType, callback: (id?: number) => void) => {
            const params = [post.title,post.description,post.user_id,Date.now(),Date.now()]
            database.run(SQL_CREATE_POST, params, function(_err) {
                callback(this?.lastID)
            })
    },
    readAll: (callback: (post: postType[]) => void) => {
        const params: any[] = []
        database.all(SQL_GET_POST, params, (_err, rows) => {
            rows.forEach((item:postType,index)=>{
                item.views++
                const itemParams = [item.views,item.id]
                database.run(SQL_INCREMENT_VIEW,itemParams,(incErr)=>{
                    if(incErr){console.log(incErr);}
                })
            })
            callback(rows)
        })
    },
    readOne: (id: number, callback: (post?: postType) => void) => {
        const params = [id]
        database.get(SQL_GET_ONE_POST, params, (_err, row) => {
            if(row){
                const incViewParams = [row.views+1,id]
                database.run(SQL_INCREMENT_VIEW,incViewParams,(incErr)=>{
                    if(incErr){console.log(incErr);}
                })
            }
            callback(row)
        })
    },
    update: (id: number, post: postType, user_email:string , logged_user_id:Number ,callback: (notFound: any) => void) => {
        database.get(SQL_GET_ONE_POST, id, (_err, row) => {
            if(row){
                if(row.user_id === logged_user_id){
                    const params = [post.title, post.description,id]
                    database.run(SQL_UPDATE_POST, params, function(_err) {
                        if(!(this.changes === 0)){
                            //INSERE ALTERAÇÃO NO HISTORICO
                            const historicParams = [row.id,post.title,post.description,post.image,Date.now()]
                            database.run(SQL_INSERT_HISTORIC,historicParams,(_herr)=>{
                                if(_herr){console.log(_herr);}
                            })
                        }
                        callback({found:true,unautorized:false})
                    });
                }else{
                    callback({found:true,unautorized:true})
                }
            }else{
                callback({found:false,unautorized:false})
            }
        })
    },
    insertImage: (id: number, image: string,logged_user_id:Number ,callback: (notFound: any) => void) => {
        const params = [image,id]
        database.get(SQL_GET_ONE_POST, id, (_err, row) => {
            if(row){
                if(row.user_id === logged_user_id){
                    database.run(SQL_INSERT_IMAGE, params, function(_err) {
                        if(this.changes != 0){
                             //INSERE ALTERAÇÃO NO HISTORICO
                            const historicParams = [id,row.title,row.description,image,Date.now()]
                            database.run(SQL_INSERT_HISTORIC,historicParams,(_err)=>{
                                if(_err){console.log(_err);}
                            })
                        }
                        callback({found:true,unautorized:false})
            
                    })

                }else{
                    callback({found:true,unautorized:true})
                }
            }else{
                callback({found:false,unautorized:false})
            }

        })
        
    },
    delete: (id: number, user_email:string , user_id:number ,callback: (notFound: any) => void) => {
        const params = [id]
        database.get(SQL_GET_ONE_POST, params, (_err, row) => {
            if(row){
                if(row.user_id === user_id){
                    database.run(SQL_DELETE_POST, params, function(_err) {
                        callback(this.changes === 0)
                    })
                }else{
                    callback({unautorized:true,found:true})
                }
            }else{
                callback({found:true})
            }
        })
    },


    like: (post_id:number,user_id:number ,callback: (notFound: any) => void) => {
        database.get(SQL_GET_ONE_POST, [post_id], (_err, row) => {
            if(row){
                const params = [post_id,user_id,Date.now()]
                database.run(SQL_INCREMENT_LIKE, params, function(_err) {
                    callback({found:true,unautorized:false})
                });
            }else{
                callback({found:false,unautorized:false})
            }
        })
    },

    unlike: (post_id:number,user_id:number ,callback: (notFound: any) => void) => {
        database.get(SQL_GET_ONE_POST, post_id, (_err, row) => {
            if(row){
                const params = [post_id,user_id,Date.now()]
                database.run(SQL_INCREMENT_UNLINE, params, function(_err) {
                    callback({found:true,unautorized:false})
                });
            }else{
                callback({found:false,unautorized:false})
            }
        })
    }
    
}

export default usersTransactions
import database from '../db/db'
import postType from '../models/post'

const SQL_GET_POST = `SELECT title,views,(SELECT COUNT(*) FROM likes WHERE likes.post_id=posts.id)  as likes, (SELECT COUNT(*) FROM unlikes WHERE unlikes.post_id=posts.id)  as unlikes, (SELECT COUNT(*) FROM comments WHERE comments.post_id=posts.id) as comments,removed  FROM posts`;

const reportsTransactions = {
    report: (callback: (post: postType[]) => void) => {
        const params: any[] = []
        database.all(SQL_GET_POST, params, (_err, rows) => {
            callback(rows)
        })
    },
    
}

export default reportsTransactions
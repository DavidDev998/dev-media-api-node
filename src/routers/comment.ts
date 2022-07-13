import express from 'express'

import commentDb from '../controllers/comments'

import commentType from '../models/comment'
import middleware from '../controllers/middleware'

const commentsRouter = express.Router()

commentsRouter.post('/comments', middleware,(req:any, res) => {
    const body:commentType = req.body
    body.user_id = req.user_id
    commentDb.createPost(body,
        (id)=>{
            if(id){
                commentDb.readOne(id,(comment) => {
                    if(comment){
                        res.status(201).location(`/comments/${id}`).json(comment)
                    }else{
                        res.status(201).location(`/comments/${id}`).send()
                    }
                })
            }else{
                res.status(400).send()
            }
        }
    )
})
commentsRouter.get('/comments', (req, res) => {
    commentDb.readAll((comments) => res.json(comments))
})
commentsRouter.get('/comments/:id', (req, res) => {
    const id: number = +req.params.id
    commentDb.readOne(id, (comments) => {
        if (comments) {
            res.json(comments)
        } else {
            res.status(404).send()
        }
    })
})
commentsRouter.put('/comments/:id', middleware,(req:any, res) => {
    const id: number = +req.params.id
    const toUpdate: commentType = req.body
    toUpdate.user_id = req.user_id
    commentDb.update(id, toUpdate, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
commentsRouter.delete('/comments/:id', middleware,(req:any, res) => {
    const id: number = +req.params.id
    commentDb.delete(id,req.user_id ,(notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
export default commentsRouter

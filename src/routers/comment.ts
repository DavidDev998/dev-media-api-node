import express from 'express'

import commentDb from '../controllers/comments'

import commentType from '../models/comment'

const commentsRouter = express.Router()

commentsRouter.post('/comments', (req, res) => {
    const body:commentType = req.body
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
commentsRouter.put('/comments/:id', (req, res) => {
    const id: number = +req.params.id
    const toUpdate: commentType = req.body
    commentDb.update(id, toUpdate, (notFound) => {
        if (notFound) {
            console.log('notfound');
            
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
commentsRouter.delete('/comments/:id', (req, res) => {
    const id: number = +req.params.id
    commentDb.delete(id, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
export default commentsRouter

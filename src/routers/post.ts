import express from 'express'

import postDb from '../controllers/posts'

import postType from '../models/post'
import middleware from '../controllers/middleware'

const postsRouter = express.Router()

postsRouter.post('/posts', middleware,(req:any, res) => {
    const body:postType = req.body
    body.user_id = req.user_id
    postDb.createPost(body,
        (id)=>{
            if(id){
                postDb.readOne(id,(post) => {
                    if(post){
                        res.status(201).location(`/posts/${id}`).json(post)
                    }else{
                        res.status(201).location(`/posts/${id}`).send()
                    }
                })
            }else{
                res.status(400).send()
            }
        }
    )
})
postsRouter.get('/posts', (req, res) => {
    postDb.readAll((posts) => res.json(posts))
})
postsRouter.get('/posts/:id', (req, res) => {
    const id: number = +req.params.id
    postDb.readOne(id, (posts) => {
        if (posts) {
            res.json(posts)
        } else {
            res.status(404).send()
        }
    })
})
postsRouter.put('/posts/:id', middleware,(req:any, res) => {
    const id: number = +req.params.id
    const toUpdate: postType = req.body
    postDb.update(id, toUpdate, req.email ,req.user_id,(resp) => {
        if(resp.unautorized){
            res.status(401).send("usuário não autorizado")
            return
        }
        if (!resp.found) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

postsRouter.put('/posts/insertimage/:id', middleware,(req:any, res) => {
    const id: number = +req.params.id
    const image: string = req.body.image
    postDb.insertImage(id, image, req.user_id,(resp) => {
        if(resp.unautorized){
            res.status(401).send("usuário não autorizado")
            return
        }
        if (!resp.found) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

postsRouter.delete('/posts/:id', middleware,(req:any, res) => {
    const id: number = +req.params.id
    postDb.delete(id, req.email , req.user_id,(resp) => {
        if(resp.unautorized){
            res.status(401).send("Usuario não autorizado")
        }
        if (resp.found) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

postsRouter.post('/posts/like/:id', middleware,(req:any, res) => {
    const post: number = parseInt(req.params.id) 
    postDb.like(post,req.user_id,(resp) => {
        if(resp.unautorized){
            res.status(401).send("Usuario não autorizado")
        }
        if (!resp.found) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

postsRouter.post('/posts/unlike/:id', middleware,(req:any, res) => {
    const post: number = parseInt(req.params.id) 
    postDb.unlike(post,req.user_id,(resp) => {
        if(resp.unautorized){
            res.status(401).send("Usuario não autorizado")
        }
        if (!resp.found) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

export default postsRouter

import express from 'express'

import postDb from '../controllers/posts'

import postType from '../models/post'

const postsRouter = express.Router()

postsRouter.post('/posts', (req, res) => {
    const body:postType = req.body
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
postsRouter.put('/posts/:id', (req:any, res) => {
    const id: number = +req.params.id
    const toUpdate: postType = req.body
    postDb.update(id, toUpdate, req.email ,(notFound) => {
        if (notFound) {
            console.log('notfound');
            
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

postsRouter.put('/posts/insertimage/:id', (req, res) => {
    const id: number = +req.params.id
    const image: string = req.body.image
    postDb.insertImage(id, image, (notFound) => {
        if (notFound) {
            console.log('notfound');
            
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

postsRouter.delete('/posts/:id', (req:any, res) => {
    const id: number = +req.params.id
    postDb.delete(id, req.email ,(notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
export default postsRouter

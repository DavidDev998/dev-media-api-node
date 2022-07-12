import express from 'express'
import usersDB from '../controllers/users';
import authDB from '../controllers/auth';
import userType from '../models/user';
import middleware from '../controllers/middleware';

const usersRouter = express.Router()

usersRouter.post('/users', (req, res) => {
    const body: userType = req.body
    if(!body.name || !body.email || !body.password){
        res.status(400).send("Uma ou mais das informações obrigatórias estão faltando")
    }

    usersDB.register(body,
        (id)=>{
            if(id){
                usersDB.readOne(id,(user) => {
                    if(user){
                        res.status(201).location(`/users/${id}`).json(user)
                    }else{
                        res.status(201).location(`/users/${id}`).send()
                    }
                })
            }else{
                res.status(400).send("usuário já existe")
            }
        }
    )
})
usersRouter.get('/users', (req, res) => {
    usersDB.readAll((itens) => res.json(itens))
})
usersRouter.get('/users/:id', (req, res) => {
    const id: number = +req.params.id
    usersDB.readOne(id, (user) => {
        if (user) {
            res.json(user)
        } else {
            res.status(404).send()
        }
    })
})
usersRouter.put('/users/:id', middleware,(req:any, res) => {
    const id: number = +req.params.id
    const toUpdate: userType = req.body
    if(!toUpdate.name && !toUpdate.email){
        res.status(400).send()
        return
    }
    if(req.user_id != id){
        res.status(401).send("usuário não autorizado")
    }
    usersDB.update(id, toUpdate, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})
usersRouter.delete('/users/:id', (req, res) => {
    const id: number = +req.params.id
    usersDB.delete(id, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })

})

usersRouter.post('/users/login',(req,res) => {
    const user:userType = req.body
    authDB.login(user,(userReturn) => {
        if(userReturn && userReturn.token){
            res.status(200).json(userReturn)
        }else{
            res.status(401).send('Email ou senha incorreto')
        }
    })
})
export default usersRouter

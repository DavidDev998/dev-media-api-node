import express from 'express'
import reportsDb from '../controllers/reports'
import middleware from '../controllers/middleware'

const reportRouter = express.Router()

reportRouter.get('/reports/posts')

reportRouter.get('/reports/posts', middleware,(req:any, res) => {
    reportsDb.report((posts) => res.json(posts))
})

export default reportRouter

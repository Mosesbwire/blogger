const express = require('express')
const commentRouter = express.Router()
const ensureAuthenticated = require('../config/auth')

const {
    create,
    editComment,
    replyToComment,
    getArticleComments
} = require('../controllers/commentController')

commentRouter.post('/post/:id', ensureAuthenticated ,create)
commentRouter.get('/comments/:id', getArticleComments)
commentRouter.post('/reply/:id',ensureAuthenticated ,replyToComment)
commentRouter.put('/edit/:id', ensureAuthenticated ,editComment)


module.exports = commentRouter
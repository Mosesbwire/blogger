const express = require('express')

const articleRouter = express.Router()

const ensureAuthenticated = require('../config/auth')

const {create,
        getArticle,
        editArticle,
        allArticles,
        deleteArticle,
        index

} = require('../controllers/articleController')

articleRouter.get('/index',index)
articleRouter.post('/publish' ,ensureAuthenticated,create)
articleRouter.get('/articles',ensureAuthenticated,allArticles)
articleRouter.get('/:id', ensureAuthenticated,getArticle)
articleRouter.put('/:id',ensureAuthenticated,editArticle)
articleRouter.delete('/:id',ensureAuthenticated,deleteArticle)


module.exports = articleRouter
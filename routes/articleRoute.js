const express = require('express')

const articleRouter = express.Router()

const {create,
        getArticle,
        editArticle,
        allArticles,
        deleteArticle

} = require('../controllers/articleController')


articleRouter.post('/publish', create)
articleRouter.get('/articles', allArticles)
articleRouter.get('/:id', getArticle)
articleRouter.put('/:id',editArticle)
articleRouter.delete('/:id', deleteArticle)


module.exports = articleRouter
const Article = require('../models/articleModel')
const { body, validationResult} = require('express-validator')

const create = [
    body('title').trim().isLength({min: 5}).escape()
    .withMessage('Title is too short'),
    
    body('body').trim().isLength({min:1}).escape()
    .withMessage('Article body cannot be empty'),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const article = new Article({
            author: req.user.id,
            title: req.body.title,
            body: req.body.body,
            publishDate: Date.now()
        })

        article.save((err)=>{
            if(err){ return next(err)}

            res.status(201).json({message: 'Article was successfully published'})
        })
    }

]

function allArticles(req,res,next){
    Article.find({author: req.user.id}, function(err,articles){
        if(err){ return next(err)}

        res.status(200).json(articles)
    })

}

function getArticle(req,res,next){
    Article.findById(req.params.id, function(err, article){
        if(err){ return next(err)}

        if(!article){
            return res.status(404).json({message: 'Article not found!!'})
        }

        if(article.author.toString() !== req.user.id.toString()){
            
            return res.status(400).json({message: 'You are not authorized to access this article'})
        }

        res.status(200).json(article)
    })
}

function deleteArticle(req,res,next){
    Article.findByIdAndDelete(req.params.id, function(err,article){
        if(err){ return next(err)}

        if(!article){
            return res.status(404).json({message: 'Article not found!!'})
        }

        if(article.author.toString() !== req.user.id.toString()){
            
            return res.status(400).json({message: 'You are not authorized to access this article'})
        }

        res.status(200).json({article, message:'Article was deleted'})
    })
}

const editArticle = [
    body('title').trim().isLength({min: 5}).escape()
    .withMessage('Title is too short'),
    

    body('body').trim().isLength({min:1}).escape()
    .withMessage('Article body cannot be empty'),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        Article.findById(req.params.id, function(err,article){
            if(err){ return next(err)}

            if(!article){
                return res.status(404).json({message: 'Article not found!!'})
            }
    
            if(article.author.toString() !== req.user.id.toString()){
            
                return res.status(400).json({message: 'You are not authorized to access this article'})
            }

            article._id = article._id
            article.author = req.user.id
            article.title = req.body.title || article.title
            article.body = req.body.body || article.body
            article.publishDate = article.publishDate
            article.updated = true
            article.updateDate = Date.now()

            article.save((err)=>{
                if(err){ return next(err)}

                res.status(200).json(article)
            })
        })
    }

]

module.exports = {
    create,
    allArticles,
    getArticle,
    deleteArticle,
    editArticle
}
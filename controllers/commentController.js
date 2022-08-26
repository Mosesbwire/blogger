const Comment = require('../models/commentModel')
const Article = require('../models/articleModel')

const {body, validationResult} = require('express-validator')

const create = [
    body('comment').trim().isLength({min: 1}).escape()
    .withMessage('Comment cannot be empty'),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const comment = new Comment({
            commentor: req.user.id,
            comment: req.body.comment,
            date: Date.now()
        })

        comment.save((err)=>{
            if(err){ return next(err)}

            Article.findById(req.params.id, (err,article)=>{
                if(err){ return next(err)}

                article.comments.push(comment._id)

                article.save((err)=>{
                    if(err){ return next(err)}
                    res.status(201).json(comment)
                })
            })
        })
    }
]


async function getArticleComments(req,res){
    try {
        const articleComments = await Article.findById(req.params.id).populate('comments')
        res.status(200).json(articleComments)
        
    } catch (error) {
        res.status(500).json({message: 'An error occured on the server'})
    }
    
}

function editComment(req,res,next){
    Comment.findById(req.params.id, (err, comment)=>{
        if(err){ return next(err)}
        if(req.user.id.toString() !== comment.commentor.toString()){
            return res.status(401).json({message: 'You are not allowed to edit this comment.You are only allowed to edit a comment you made.'})
        }
        comment.comment = req.body.comment || comment.comment
        comment.edited = true

        comment.save((err)=>{
            if(err){ return next(err)}

            res.status(200).json(comment)
        })
    })
}

function replyToComment(req,res,next){
    const reply = new Comment({
        commentor: req.user.id,
        comment: req.body.comment,
        date: Date.now()
    })

    reply.save((err)=>{
        if(err) {return next(err)}
        Comment.findById(req.params.id, (err,comment)=>{
            if(err){ return next(err)}

            comment.replies.push(reply._id)

            comment.save((err)=>{
                if(err){ return next(err)}

                res.status(201).json(reply)
            })
        })
    })
}
// how to handle delete request for linked documents
function deleteComment(req,res,next){

}


module.exports = {
    create,
    getArticleComments, 
    replyToComment,
    editComment
}


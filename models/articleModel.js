const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    commentor: {type: Schema.Types.ObjectId, required: true},
    comment: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    replies: [{
        commentor: {type: Schema.Types.ObjectId, required: true},
        comment: {type: String, required: true},
        date: {type: Date, default: Date.now()},
    }]
})

const ArticleSchema = new Schema({
    author: {type: Schema.Types.ObjectId, required: true},
    publishDate: {type: Date, required: true, default: Date.now()},
    title: {type: String,required: true},
    body: {type: String, required: true},
    updated: {type: Boolean, default: false},
    updateDate: {type: Date},
    comments: [CommentSchema]
})

module.exports = mongoose.model('Article', ArticleSchema)
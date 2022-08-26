const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'Author',required: true},
    publishDate: {type: Date, required: true, default: Date.now()},
    title: {type: String,required: true},
    body: {type: String, required: true},
    updated: {type: Boolean, default: false},
    updateDate: {type: Date},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
})

module.exports = mongoose.model('Article', ArticleSchema)
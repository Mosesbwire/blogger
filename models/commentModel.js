const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    commenter: {type: Schema.Types.ObjectId, ref: 'Author'},
    comment: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    edited: {type: Boolean, default: false},
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
})


module.exports = mongoose.model('Comment', CommentSchema)
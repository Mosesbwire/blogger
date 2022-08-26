const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    commenter: {type: Schema.Types.ObjectId, ref: 'Author'},
    comment: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    edited: {type: Boolean, default: false},
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    likes: {type: Number, default: 0}
})


module.exports = mongoose.model('Comment', CommentSchema)
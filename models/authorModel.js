const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const saltRounds = 8


const AuthorSchema = new Schema({
    firstname: {type: String, minLength: 2,maxLength: 100, required: true},
    lastname: {type: String, minLength: 2,maxLength: 100, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImage: {type: String, default: 'default'},
    following: [{type: Schema.Types.ObjectId, ref: 'Author'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'Author'}],
    followers_count: {type: Number, default: 0},
    following_count: {type: Number, default: 0},

})


AuthorSchema.methods.generateHash = async function(password){

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

AuthorSchema.methods.validPassword = async function(password){
    
    return await bcrypt.compare(password, this.password)
}

AuthorSchema.methods.follow = async function(user){
    this.following.push(user._id)
    this.following_count += 1
    this.save(err=>{
        if(err){ return new Error({message: 'Save failed'})}

        return {
            following: this.following_count,
            user: user
        }
    })
} 

AuthorSchema.methods.gainFollower = async function(follower){
   
    this.followers.push(follower._id)
    this.followers_count += 1
    this.save((err)=>{
        if(err){ return new Error({message: 'Save failed'})}

        return follower
    })
}






module.exports = mongoose.model('Author', AuthorSchema)
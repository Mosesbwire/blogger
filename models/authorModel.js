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

AuthorSchema.methods.follow = async function(userId){
    this.following.push(userId)
    this.following_count += 1
    this.save(err=>{
        if(err){ return new Error({message: 'Save failed'})}

        return this.following_count
    })
}


AuthorSchema.methods.unfollow = async function(userId){
    let index = this.following.findIndex(element => element.toString() === userId.toString())
    this.following.splice(index,1)
    this.following_count -= 1
    this.save(err =>{
        if(err){ return new Error({error: 'Save failed'})}
        return this.following_count
    })
}
AuthorSchema.methods.loseFollower = async function(userId){
    let index = this.followers.findIndex(element => element.toString() === userId.toString())
    this.followers.splice(index,1)
    this.followers_count -= 1
    this.save(err =>{
        if(err){ return new Error({error: 'Save failed'})}
        return this.followers_count
    })
    
}

AuthorSchema.methods.gainFollower = async function(followerId){
   
    this.followers.push(followerId)
    this.followers_count += 1
    this.save((err)=>{
        if(err){ return new Error({message: 'Save failed'})}

        return this.followers_count
    })
}


AuthorSchema.methods.followingUser = async function(user){
    let isFollower
    this.following.some((userId)=>{
        if(userId.toString() === user.toString()){
            isFollower = true
        }else {
            isFollower = false
        }
    })
    return isFollower
}





module.exports = mongoose.model('Author', AuthorSchema)
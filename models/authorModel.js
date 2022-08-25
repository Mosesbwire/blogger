const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const saltRounds = 8


const AuthorSchema = new Schema({
    firstname: {type: String, minLength: 2,maxLength: 100, required: true},
    lastname: {type: String, minLength: 2,maxLength: 100, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImage: {type: String, default: 'default'}
})


AuthorSchema.methods.generateHash = async function(password){
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

AuthorSchema.methods.validPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}




module.exports = mongoose.model('Author', AuthorSchema)
const Author = require('../models/authorModel')
const passport = require('passport')
const {body, validationResult} = require('express-validator')



const createAuthor = [
    body('firstname').trim().isLength({min:2, max:100}).escape()
    .withMessage('First name must be specified'),
    

    body('lastname').trim().isLength({min:2, max:100}).escape()
    .withMessage('First name must be specified'),
    

    body('email').isEmail().withMessage('Invalid email address'),

    body('password').trim().isLength({min: 6})
    .withMessage('Password is too short, must be more that six characters'),


    (req,res,next)=>{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const author = new Author()

        author.firstname = req.body.firstname
        author.lastname = req.body.lastname
        author.email = req.body.email

        author.generateHash(req.body.password).then((pwd)=>{
            author.password = pwd

            author.save(function(err){
                if(err){ return next(err)}

                req.logIn(author,(err)=>{
                    if(err){ return next(err)}

                    res.status(201).json(req.user)
                })
            })
        })
    }
]


function login(req,res,next){
    passport.authenticate('local', {}, (err,user,info)=>{
        if(err){ return next(err) }

        if(!user){
            return res.status(401).json(info)
        }

        req.logIn(user,(err)=>{
            if(err) { return next(err)}
            return res.status(200).json(req.user)
        })
    })(req,res,next)

}

function logout(req,res,next){

    console.log(req.user)
    req.logOut((err)=>{
        if(err){ return next(err) }

        res.status(200).json({message: 'Successfully Logged Out !'})
    })
}

function getProfile(req,res,next){

    //return profile with url for profile pic...
    Author.findById(req.user.id,(err,author)=>{
        if(err) { return next(err)}
        

        res.status(200).json(author)
    })
}

const editProfile = [
    body('firstname').trim().isLength({min:2, max:100}).escape()
    .withMessage('First name must be specified')
    .isAlphanumeric().withMessage('Name has non alphanumeric characters'),

    body('lastname').trim().isLength({min:2, max:100}).escape()
    .withMessage('First name must be specified')
    .isAlphanumeric().withMessage('Name has non alphanumeric characters'),

    body('email').isEmail().withMessage('Invalid email address'),

    body('password').trim().isLength({min: 6})
    .withMessage('Password is too short, must be more that six characters'),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        Author.findById(req.user.id, (err,author)=>{
            if(err) {return next(err)}

            author._id = req.user.id
            author.firstname = req.body.firstname || author.firstname
            author.lastname = req.body.lastname || author.lastname
            author.email = req.body.emailname || author.email

            author.save((err)=>{
                if(err){ return next(err)}

                res.status(200).json(author)
            })    
        })
    }
]


const changePassword = [
    body('password').trim().isLength({min: 6})
    .withMessage('Password is too short, must be more that six characters'),
    body('newPassword').trim().isLength({min: 6})
    .withMessage('Password is too short, must be more that six characters'),
    body('confirmPassword').trim().isLength({min: 6})
    .withMessage('Password is too short, must be more that six characters'),

    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        Author.findById(req.user.id, (err,author)=>{
            if(err){ return next(err)}
            author.validPassword(req.body.password).then((isValid)=>{
                if(!isValid){
                    return res.status(400).json({message: 'Incorrect password'})
                }
                if(req.body.newPassword !== req.body.confirmPassword){
                    return res.status(400).json({message: 'new password does not match the confirmation password'})
                }

                author.generateHash(req.body.newPassword).then((password)=>{
                    author.password = password
                    author._id = req.user.id

                    author.save((err)=>{
                        if(err){ return next(err)}
                        res.status(200).json({message: 'Password successfully changed'})
                    })
                })
            })
        })
    }
]

function uploadProfilePicture(req,res,file){
    Author.findById(req.user.id, (err,author)=>{
        author._id = req.user.id
        author.profileImage = req.file.filename

        author.save((err)=>{
            if(err){ return next(err)}
            res.status(200).json({message: 'Upload successful'})
        })
    })
}

module.exports = {
    createAuthor,
    getProfile,
    editProfile,
    login,
    logout,
    changePassword,
    uploadProfilePicture
}
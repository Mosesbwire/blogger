const express = require('express')
const authorRouter = express.Router()
const multer = require('multer')

const ensureAuthenticated = require('../config/auth')

const{
        login,
        logout,
        editProfile,
        createAuthor,
        getProfile,
        changePassword,
        uploadProfilePicture
} = require('../controllers/authorController')

const multerStorage = multer.diskStorage({
        destination: (req,file,cb)=>{
                cb(null,'uploads/profile-pics')
        },
        filename: (req,file,cb)=>{
                
                const ext = file.mimetype.split('/')[1]
                cb(null, `${file.filename|| file.originalname}-${Date.now()}.${ext}`)
        }
})

const multerFilter = (req,file,cb)=>{
        const type = file.mimetype.split('/')[1]
        if(type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'svg'){
                cb(null,true)
        }else {
                cb(new Error("File format is not accepteed"), false)
        }
}

const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
})



authorRouter.post('/signup', createAuthor)
authorRouter.post('/login', login)
authorRouter.post('/logout',ensureAuthenticated,logout)
authorRouter.put('/edit',ensureAuthenticated,editProfile)
authorRouter.get('/view-profile',ensureAuthenticated,getProfile)
authorRouter.put('/change-password', ensureAuthenticated,changePassword)
authorRouter.post('/upload-profile-picture', ensureAuthenticated, upload.single('profile-pic'),uploadProfilePicture)


module.exports = authorRouter
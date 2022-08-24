const express = require('express')
const authorRouter = express.Router()

const ensureAuthenticated = require('../config/auth')

const{create,
        login,
        logout,
        editProfile,
        createAuthor,
        getProfile,
        changePassword
} = require('../controllers/authorController')


authorRouter.post('/signup', createAuthor)
authorRouter.post('/login', login)
authorRouter.post('/logout',ensureAuthenticated,logout)
authorRouter.put('/edit',ensureAuthenticated,editProfile)
authorRouter.get('/view-profile',ensureAuthenticated,getProfile)
authorRouter.put('/change-password', ensureAuthenticated,changePassword)


module.exports = authorRouter
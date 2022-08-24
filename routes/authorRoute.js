const express = require('express')
const authorRouter = express.Router()

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
authorRouter.post('/logout',logout)
authorRouter.put('/edit',editProfile)
authorRouter.get('/view-profile',getProfile)
authorRouter.put('/change-password', changePassword)


module.exports = authorRouter
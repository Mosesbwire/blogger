var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const path = require('path')
const dotenv = require('dotenv')
const authorRouter = require('./routes/authorRoute')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

var app = express();

require('./config/passport')(passport)

dotenv.config({path: path.resolve(__dirname, './config/.env')})

const mongoDB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tf4qlfu.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB CONNECTION ERROR'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'secret string',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())


app.use('/author', authorRouter)



module.exports = app;

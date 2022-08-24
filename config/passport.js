
const LocalStrategy = require('passport-local')
const Author = require('../models/authorModel')


module.exports = function(passport){
    passport.use('local', new LocalStrategy({
      usernameField: 'email'
    },

    function verify(username,password,cb){

        Author.findOne({email: username},function(err,author){
            if(err){ return cb(err)}

            if(!author){
                return cb(null,false, {message: 'Email provided does not exist'})
            }

            author.validPassword(password).then((valid)=>{
                if(!valid){ return cb(null,false, {message: 'Invalid password'})}

                return cb(null,author)
            })
        })

    }))

    passport.serializeUser(function(user, cb) {
    
        process.nextTick(function() {
          cb(null, { id: user._id, username: user.email });
        });
      });
      
    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, user);
        });
      });
}
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next()
    }else{
        res.status(401).json({message: 'Your are not logged in. Kindly log in to access this resource.'})
    }
}


module.exports = ensureAuthenticated
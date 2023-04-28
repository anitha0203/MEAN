
const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decodedtoken = jwt.verify(token, process.env.JWT_KEY)
        req.userData = {email: decodedtoken.email, userId: decodedtoken.userId}
        next()
    } catch (error){
        res.status(401).json({message: "You are not authenticated!"})
    }

}
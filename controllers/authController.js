const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res) =>{
    const {user, pwd} = req.body;
    if(!user || !pwd){
        return res.status(400).json({"message": "Username and password are required"});
    }
    const foundUser = await User.findOne({username:user}).exec();
    if(!foundUser){
        return res.sendStatus(401);
    }//evaluate password (encrypted one using bcrypt)
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles);
        //create JWT to user with other routes that
        //we want protected for other apis
        //JSON Web Tokens
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "username":foundUser.username,
                    "roles":roles
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        //sending the refresh token as cookie to httpOnly
        //so that js cant access it (max age is 24 hr here)
        //not letting js assess it is for security reasons
        //it is required in chrome tho
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        res.json({accessToken});
    }else{//401 unothrized
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
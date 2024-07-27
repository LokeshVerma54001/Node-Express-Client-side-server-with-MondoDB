const User = require('../model/User');
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) =>{
    const cookies = req.cookies;
    //checking for cookies and jwt property in it
    if(!cookies?.jwt){
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    // use exec when using await 
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){//forbidden 403
        return res.sendStatus(403);
    }//evaluate jwt (for token varification)
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded)=>{
            if(err || foundUser.username !== decoded.username){
                return res.sendStatus(403);
            }
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({accessToken});
        }
    );
}

module.exports = {handleRefreshToken};
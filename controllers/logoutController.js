const User = require('../model/User');

const handleLogout = async (req, res) =>{
    //on client, also delete the access token
    const cookies = req.cookies;
    //checking for cookies and jwt property in it
    if(!cookies?.jwt){
        return res.sendstatus(204);//no content to send back
    }
    const refreshToken = cookies.jwt;

    //is refresh token in db?
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }
    //delete the refresh token in the db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    //add secure flag in production later for https
    res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false});
    res.sendStatus(204);
}

module.exports = {handleLogout};
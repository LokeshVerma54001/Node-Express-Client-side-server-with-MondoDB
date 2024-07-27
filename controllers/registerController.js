const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) =>{
    // taking user and password from request body
    const {user, pwd} = req.body;
    if(!user || !pwd){
        return res.status(400).json({"message":"Username and password are required"});
    }// check for duplicate usernames in the db
    const duplicate = await User.findOne({username:user}).exec();
    if(duplicate){
        //conflict status
        return res.sendStatus(409);
    }try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });
        //can also be created like with dot notation
        // const newUser = new User();
        // newUser.username = user;
        // const result = await newUser.save();
        //or
        // const newUser = new User({
        //     "username": user,
        //     "password": hashedPwd
        // });
        // const result = await newUser.save();
        console.log(result);
        res.status(201).json({"success": `New User ${user} created!`});
    }catch(err){
        res.status(500).json({"message": err.message});
    }
}

module.exports = {handleNewUser};
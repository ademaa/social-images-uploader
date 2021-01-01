const express = require('express');
const router = express.Router();
const User  = require('../../models/User');
const gravatar = require('gravatar');
const config =require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');

//@route  post api/user
//@des    register user
//access  public
router.post("/",[
    //check if user add name,email and password
    check('name','name is required').not().isEmpty(),
    check('email','email is required').isEmail(),
    check('password','password is required').isLength({min:6})
],async(req,res)=>{
    //return array of errors if data is missing 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //request name,email and password from body 
    const {name,email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"user already exists!"});
        }
        //to get user avatar from email 
        let avatar = gravatar.url({
            s:"200",
            r:"pg",
            d:"mm"
        });
        //add user to collection
        user = new User({
            name,
            email,
            avatar,
            password
        });
        //hash password user enterd using bcryptjs
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        //save user to database
        await user.save();
        //create token to the user
        const payload = {
            user:{
                id:user.id
            }
        };
        jwt.sign(payload,config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err;
            res.json({token});
        }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
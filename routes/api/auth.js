const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const bcrypt =  require('bcryptjs');
const {check,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route  get api/auth
//@des    auhtorize user 
//access  private
router.get("/",auth,async(req,res)=>{
try {
    //select each user except passwords
    const users = await User.findById(req.user.id).select('-password');
    res.json(users);
} catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
}
});

//@route  get api/auth
//@des    auhtorize user 
//access  public

router.post("/",[
    check('email','email is required').isEmail(),
    check('password','password is required').exists()
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    try {
        //find if this user exists inn database or not
        const user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"invalid credintials"});
        }
        //compare password user entered with password in database 
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:"invalid credintials"});
        }
        const payload = {
            user:{
                id:user.id
            }
        };
        jwt.sign(payload,
        config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err;
            res.json({token});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
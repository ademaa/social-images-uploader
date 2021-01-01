const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User =require('../../models/User');
const auth = require('../../middleware/auth');


//@route   post api/profile
//@des     create profile
//@access  private
router.post('/',auth,async(req,res)=>{
    try {
        const posts = await Post.findOne({user:req.user.id});
        let profile = await Profile.findOne({user:req.user.id});
        if(!posts){
            return res.status(404).json({msg:"no posts to get notification"});
        }
        if(profile){
            return res.status(400).json({msg:"profile already exists"});
        }
        profile = new Profile({user:req.user.id});
            await profile.save();
            res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route   put api/profile/notifcation/comment
//@des     update comments notifcations profile
//@access  private
router.put('/notifcation/comment',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const posts = await Post.findOne({user:req.user.id});
        posts.comments.map(comment=>{ 
            profile.notifications.unshift(comment.user);
        });        
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
//@route   put api/profile/notifcation/like
//@des     update likes notifcations profile
//@access  private
router.put('/notifcation/like',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const posts = await Post.findOne({user:req.user.id});
        posts.likes.map(like=>{ 
            profile.notifications.unshift(like.user);
        });        
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route   get api/profile/notifcation
//@des     get all notifcations 
//@access  private
router.get('/notifcation',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
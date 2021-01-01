const express = require('express');
const router = express.Router();
const multer =  require('multer');
const store  = require('../../middleware/multer');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const fs = require('fs');
const {check,validationResult} = require('express-validator');

//@route  post api/posts
//@des    create new post
//access  private
router.post("/",[store.array('images',5),auth],async(req,res)=>{
    const files = req.files;
    if(!files){
        return res.status(400).json({msg:"no file to upload"});
    }
    try {
        const user = await User.findById(req.user.id).select("-password");
        //covert eash photo to base 64
        let imageArr = files.map(image=>{
            let img = fs.readFileSync(image.path);
            return img.toString('base64');
        });
        let finalImage ={};
        let newPost;
         imageArr.map((src,index) =>{
            
                finalImage = {
                    filename:files[index].filename,
                    contentType:files[index].mimetype,
                    imageBase64:src,
                    name:user.name,
                    avatar:user.avatar,
                    user:req.user.id
                }
                 newPost = new Post(finalImage);
        });
         await newPost.save(err => {
            if(err){
                return res.json({msg:"canot save to database"});
            }else{
                return res.json({msg:"save succssfully"});
            }
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route  get api/posts
//@des    get all posts
//access  private
router.get('/',auth,async(req,res)=>{
    try {
        //get posts by last one added using sort({date:-1})
        const posts = await Post.find().sort({date:-1});
        if(!posts){
            return res.status(404).json({msg:"no posts found"});
        }
        res.json(posts);
    } catch (err) {
        console.error(er.message);
        res.status(500).send("Server Error");
    }
});

//@route  delete api/posts/:id
//@des    get  post by id
//access  private
router.delete('/:id',auth,async(req,res)=>{
    try {
        //get posts by last one added using sort({date:-1})
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"post not found"});
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        //if user enter not valid id
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"post not found"});
        }
        res.status(500).send("Server Error");
    }
});

//@route  put api/posts/like/:id
//@des    like  post by id
//access  private
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString()=== req.user.id).length > 0){
            return res.status(400).json({msg:"post already liked"});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route  put api/posts/unlike/:id
//@des    unlike  post by id
//access  private
router.put('/unlike/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString()=== req.user.id).length === 0){
            return res.status(400).json({msg:"post already unliked"});
        }
        const removeindex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeindex,1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route  put api/posts/comment/:id
//@des    comment  post by id
//access  private
router.put('/comment/:id',[auth,[
    check('text','text is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id).select("-password");
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route  delete api/posts/comment/:id
//@des    delete comment  post by id
//access  private
router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id).select("-password");
        const comment  = post.comments.find(comment => comment.id === req.params.comment_id);
        if(!comment){
            return res.status(404).json({msg:"no comment found"});
        }
        if(comment.user.toString()!== req.user.id){
            return res.status(401).json({msg:"user not authorized"});
        }
        const removeIndex = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);
        await post.save();
        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
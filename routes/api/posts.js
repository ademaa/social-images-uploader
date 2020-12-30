const express = require('express');
const router = express.Router();

//@route  get api/post
//@des    test posts
//access  public
router.get("/",(req,res)=>res.send("test posts"));

module.exports = router;
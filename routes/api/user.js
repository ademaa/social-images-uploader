const express = require('express');
const router = express.Router();

//@route  get api/user
//@des    test user
//access  public
router.get("/",(req,res)=>res.send("test user"));

module.exports = router;
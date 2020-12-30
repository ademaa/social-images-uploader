const express = require('express');
const router = express.Router();

//@route  get api/auth
//@des    test auth
//access  public
router.get("/",(req,res)=>res.send("test auth"));

module.exports = router;
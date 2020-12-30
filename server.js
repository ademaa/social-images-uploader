const express = require('express');
const app = express();

app.get('',(req,res)=>res.send('home route'));


//listen to port
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`server start at port ${port}`));
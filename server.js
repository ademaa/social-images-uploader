const express = require('express');
const app = express();
const connectDB = require('./config/db');

//connect database
connectDB();

//initialize middleware
app.use(express.json({extended:false}));

app.get('/',(req,res)=>res.send("API run successfully"));

//get all routes
app.use('/api/user',require('./routes/api/user'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));

//listen to port
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`server start at port ${port}`));
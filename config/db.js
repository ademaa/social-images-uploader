const mongoose = require('mongoose');
const config = require('config');

let connectDB = async()=>{
    try {
       await  mongoose.connect(config.get('mongoUrl'),{
               useNewUrlParser:true,
               useUnifiedTopology: true,
               useCreateIndex:true,
               useFindAndModify:false  
           });
           console.log("database connected ...")
    } catch(err){
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
}


module.exports = connectDB;
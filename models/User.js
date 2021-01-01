const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    notifications:{
        likes:{
            type:schema.Types.ObjectId,
            ref:'posts'
        },
        comments:{
            type:schema.Types.ObjectId,
            ref:'posts'
        }
    }
});
module.exports = User = mongoose.model('user',userSchema);
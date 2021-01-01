const mongoose = require('mongoose');
const schema = mongoose.Schema;

const profileSchema = new schema({
    user:{
        type:schema.Types.ObjectId,
        ref:'users'
    },
    notifications:[{
        likes:{
            type:schema.Types.ObjectId,
            ref:'posts'
        },
        comments:{
            type:schema.Types.ObjectId,
            ref:'posts'
        },
        date:{
            type:Date,
            default:Date.now
        }
    }]
});
module.exports = Profile = mongoose.model('profile',profileSchema);
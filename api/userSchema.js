const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    _id:{
type:Number,
required:true,
    },
    name: {
        type: String,
        required: true,
    },
    lastname:{
type:String,
required:true
    },
    phone:{
type:Number,
required:true
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

},{_id:false});


const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const UserSchema = new Schema({
firstName:{
    type:String,
    require:true
},
lastName:{
    type:String, 
    require:true
},
fullName:{
    type:String,
    required:true
},
role:{
    type:String,
    required:true,
    default:'User',
    enum:['Admin','User']

},
contact: {
    type: String,
    required: true
},
forgotToken: {
    type: String,
    default: ""
},
image:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
isDeleted:{
    type: Boolean,
    default: false
}

},{
    timestamps:true,
    versionKey:false
})

module.exports = new mongoose.model('logged-in-user', UserSchema)
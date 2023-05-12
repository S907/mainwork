const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "post-blog"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true,
    versionKey:false
});


module.exports = new mongoose.model('comment-model', commentSchema);
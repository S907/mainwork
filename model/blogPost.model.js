const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const PostSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "user-category"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user-model"
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    postText: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
   createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true,
    versionKey:false
});


PostSchema.plugin(aggregatePaginate);


module.exports= new mongoose.model("post-blog", PostSchema);


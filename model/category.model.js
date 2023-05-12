const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    }
},{
    timestamps:true,
    versionKey:false
})

module.exports = new mongoose.model("user-category", CategorySchema);
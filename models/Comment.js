var mongoose = require("mongoose");
var moment = require("moment");
moment().format();

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment().format("MMMM DD, YYYY hh:mm a")
    },
    authorId: {
        type: String,
        required: true
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
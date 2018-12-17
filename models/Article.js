var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    imgRef: {
        type: String,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
var mongoose = require("mongoose");
var findOrCreate = require("mongoose-find-or-create");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    oauthToken: {
        type: String,
        required: true,
        unique: true
    },
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "Article"
    }]
});

UserSchema.plugin(findOrCreate);

var User = mongoose.model("User", UserSchema);

module.exports = User;
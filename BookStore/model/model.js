const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    Bookcatagary: {
        type: String,
        required: true,
    },
    bookprice: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model("userDatabase", userSchema);

module.exports = UserModel;

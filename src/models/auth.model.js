/* jshint esversion: 6 */

const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("User", AuthSchema, "User");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// passport-local-mongoose by default adds username and password fields and salt to the schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose); // adds username, hash and salt fields to store the username, the hashed password and the salt value

module.exports = mongoose.model('User', userSchema);
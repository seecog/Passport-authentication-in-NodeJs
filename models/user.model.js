var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    pic : String
})

module.exports = mongoose.model('User',UserSchema);

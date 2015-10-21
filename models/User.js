var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name: String,
	password: String,
	isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema);
console.log("Successfully created User model.")
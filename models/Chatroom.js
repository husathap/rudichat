var mongoose = require('mongoose');

var chatroomSchema = mongoose.Schema({
	name: String,
	createdOn: Date,
	users: [String]
});

module.exports = mongoose.model('Chatroom', chatroomSchema);
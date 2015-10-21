var mongoose = require('mongoose');

var chatroomSchema = mongoose.Schema({
	user: String,
	content: String,
	createdOn: Date,
	chatroom: String
});

module.exports = mongoose.model('Chat', chatroomSchema);
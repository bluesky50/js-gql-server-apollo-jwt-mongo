const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
}, { versionKey: false });

PostSchema.methods.toJSON = function() {
	const post = this;
	const postObject = post.toObject();
	return {
		_id: postObject._id.toString(),
		title: postObject.title,
		content: postObject.content,
		author: postObject.author
	}
}

const Post = mongoose.model('Post', PostSchema);

export default Post;

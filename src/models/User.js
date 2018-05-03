import jwt from 'jsonwebtoken';
import { UserError } from 'graphql-errors';
import bcrypt from 'bcrypt';
import _ from 'lodash';
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String,
	}
}, { versionKey: false });

UserSchema.statics.findByToken = function(token, userId) {
	const User = this;
	let decoded; 
	
	// for graphql consider throwing an error.
	// validation is done in util function.
	// try {
	// 	decoded = jwt.verify(token, process.env.JWT_SECRET);
	// } catch(e) {
	// 	return Promise.reject(new UserError('Invalid token.'));
	// }
	
	if (token) {
		return User.findOne({
			'_id': userId,
			'token': token
		})
		.then((user) => {
			if (user) return user;
			return undefined;
		});
	} else {
		return Promise.reject(new UserError('No user found for token.'));
	}
}

// UserSchema.statics.findByCredentials = function(username, password) {
// 	const User = this;
// 	return User.findOne({
// 		username
// 	})
// 	.then((user) => {
// 		if (!user) {
// 			// For graphql consider throwing an error.
// 			return Promise.reject(new UserError('Invlalid info.'));
// 		}
// 		return new Promise((resolve, reject) => {
// 			bcrypt.compare(password, user.password, (err, result) => {
// 				if (result) {
// 					resolve(user);
// 				} else {
// 					reject(new UserError('Invalid info.'));
// 				}
// 			})
// 		})
// 	})
// 	.catch((e) => {
// 		throw new UserError(e.message);
// 	});
// }

UserSchema.statics.findByCredentials = async function(username, password) {
	const User = this;
	const user = await User.findOne({ username });
	if (!user) throw new UserError('Invalid info.');

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) throw new UserError('Invalid info.');

	return user;
}

UserSchema.methods.generateAuthToken = function() {
	const user = this;
	const access = 'auth';
	const token = jwt.sign(
		{
			user: _.pick(user, ['_id', 'username']),
			access
		}, 
		process.env.JWT_SECRET,
		{
			expiresIn: '24h'
		}
	).toString();

	user.token = token;
	return user.save();
}

UserSchema.pre('save', function(next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		})
	} else {
		next();
	}
});

UserSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();
	return {
		_id: userObject._id.toString(),
		username: userObject.username,
		email: userObject.email,
		token: userObject.token
	}
}

// UserSchema.methods.toJSON = function() {
// 	const user = this;
// 	const userObject = user.toObject();
// 	return _.pick(userObject, ['_id', 'username', 'email', 'token'])
// }

const User = mongoose.model('User', UserSchema);

export default User;
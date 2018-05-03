import { getUserFromAuthToken } from './utils/utils.js';

export default {
	Query: {
		posts: async (parent, args, ctx) => {
			const posts = await ctx.Post.find().populate('author', 'username').exec();
			return posts;
		},
		post: async (parent, args, ctx) => {
			const post = await ctx.Post.findById(args.id).populate('author', 'username').exec();
			return post;
		},
		users: async (parent, args, ctx) => {
			if (ctx.state.user) {
				const users = await ctx.User.find();
				return users;
			} else {
				throw new Error('Permission denied.');
			}
		},
		user: async (parent, args, ctx) => {
			if (ctx.state.user) {
				const user = await ctx.User.findById(args.id);
				user._id = user._id.toString();
				return user;
			} else {
				throw new Error('Permission denied.');
			}
		},
		userByToken: async (parent, args, ctx) => {
			const user = await ctx.User.findByToken(args.token);
		},
		login: async (parent, args, ctx) => {
			const user = await ctx.User.findByCredentials(args.username, args.password);
			return user;
		},
		me: async (parent, args, ctx) => {
			const user = await ctx.state.user;
			return user;
		}
	},
	Mutation: {
		createPost: async (parent, args, ctx) => {
			if (ctx.state.user) {
				let newPost = await new ctx.Post({ title: args.title, content: args.content, author: ctx.state.user._id }).populate('author').save();
				newPost = await newPost.populate('author', 'username').execPopulate();
				return newPost;
			} else {
				throw new Error('Permission denied.');
			}
		},
		createUser: async (parent, args, ctx) => {
			if (ctx.state.user) {
				const newUser = await new ctx.User({ username: args.username, email: args.email, password: args.password }).save();
				return newUser;
			} else {
				throw new Error('Permission denied.');
			}
		},
		register: async (parent, args, ctx) => {
			const newUser = await new ctx.User({ username: args.username, email: args.email, password: args.password }).save();
			const newUserWithAuth = await newUser.generateAuthToken();
			return newUserWithAuth;
		}
	}
}
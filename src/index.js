require('./configs/processConfig');

import express from 'express';
import bodyParser from 'body-parser';

import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { getUserFromAuthToken } from './utils/utils.js';

import typeDefs from './schema';
import resolvers from './resolvers';

const mongoose = require('mongoose');
import User from './models/User.js';
import Post from './models/Post.js';

mongoose.connect(process.env.DB_URI);
mongoose.Promise = global.Promise;

const PORT = 5000;

const app = express();
app.use(async (req, res, next) => {
	req.state = {}; 
	const user = await getUserFromAuthToken(req);
	if (!user) {
		await next();
		return;
	}
	req.state.user = user;
	await next();
});

const graphqlEndpoint = '/graphql';

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress(req => ({ schema, context: { User, Post, state: req.state }})));
app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
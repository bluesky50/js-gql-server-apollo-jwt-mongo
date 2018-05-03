export default `

type User {
	_id: String!
	username: String!
	email: String
	token: String
}

type Post {
	_id: String!
	title: String!
	content: String!
	author: User
}

type Query {
	posts: [Post!]!
	post(id: String!): Post!
	users: [User!]!
	user(id: String!): User!
	userByToken(token: String!): User!
	login(username: String, password: String!): User!
	me: User
}

type Mutation {
	createPost(title: String!, content: String!): Post!
	createUser(username: String!, email: String!, password: String!): User!
	register(username: String!, email: String!, password: String!): User!
}

`;
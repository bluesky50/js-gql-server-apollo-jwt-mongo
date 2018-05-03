require('./configs/processConfig');

const jwt = require('jsonwebtoken');

const user = {
	username: 'test',
	_id: "123456"
}
const access = 'auth';

const token = jwt.sign({ user, access }, process.env.JWT_SECRET, { expiresIn: '24h' });

async function test(token) {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	console.log(decoded);
}

test(token);
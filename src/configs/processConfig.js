process.env.NODE_ENV = 'dev';

const env = process.env.NODE_ENV;

const processConfig = {
	JWT_SECRET: 'abc123',
	DB_URI: 'mongodb://localhost/grahpqlTest'
}

if (env === 'test' || env === 'dev') {
	Object.keys(processConfig).forEach((k) => {
		process.env[k] = processConfig[k];
	});
}
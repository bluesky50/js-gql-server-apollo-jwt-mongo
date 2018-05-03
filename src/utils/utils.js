import jwt from 'jsonwebtoken';
import User from '../models/User';

export async function getUserFromAuthToken(req) {
	// console.log(ctx);
	// console.log(req.headers);
	const Authorization = req.headers['authorization'];
	// const Authorization = ctx.request.get('Authorization');
	// const Authorization = ctx.request.headers['Authorization'];
	// console.log(ctx.request.headers);
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		let decoded;
		try {
			decoded = await jwt.verify(token, process.env.JWT_SECRET);
			if (decoded.user._id && decoded.access === 'auth' && !isExpired(decoded)) {
				const user = await User.findByToken(token, decoded.user._id);
		
				if (user) {
					return user;
				}
			}	
		} catch (e) {
			return null;
		}
	}
	return null;
}

function isExpired(decodedToken) {
	const currentTime = Date.now() / 1000;
	if (decodedToken.exp && decodedToken.exp < currentTime) {
		return true
	}
	return false;
}
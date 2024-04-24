export const sendToken = (user, res, statusCode, message) => {
	const token = user.getJWTToken();
	const options = {
		expires: new Date(
			Date.now() + 5*24*60*60*1000
		),
		httpOnly: true,
	};

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		message, 
		user, 
	})
}
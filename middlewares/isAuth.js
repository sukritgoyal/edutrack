import jwt from "jsonwebtoken";
import {Student} from "../models/studentModel.js";
import {Teacher} from "../models/teacherModel.js";
import AppError from "./error.js";

export const isTeacher = async(req, res, next) => {
	const {token} = req.cookies;
	if(!token) {
		return next(new AppError("User not authenticated!", 401));
	}
	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const user = await Teacher.findById(decoded.id).select("name email subject");
	if(!user) {
		return next(new AppError("User not authorised!", 401));	
	}
	req.user = user;
	next();
}

export const isStudent = async(req, res, next) => {
	const {token} = req.cookies;
	if(!token) {
		return next(new AppError("User not authenticated!", 401));
	}
	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const user = await Student.findById(decoded.id).select("name email subject roll_no section");
	if(!user) {
		return next(new AppError("User not authorised!", 401));	
	}
	req.user = user;
	next();
}
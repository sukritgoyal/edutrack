import AppError from "../middlewares/error.js";
import {Student} from "../models/studentModel.js";
import {Teacher} from "../models/teacherModel.js";
import {Division} from "../models/divisionModel.js";
import {sendToken} from "../utils/jwtToken.js";

export const signup = async (req, res, next) => {
	try {
		const {name, email, password, role} = req.body;
		if(!name || !email || !password || !role) {
			return next(new AppError("All fields are required!", 400));	
		}
		if(role == "student") {
			const {section, roll_no} = req.body;
			if(!section || !roll_no) {
				return next(new AppError("All fields are required!", 400));	
			}
			const div = await Division.findById(section);
			if(!div) {
				return next(new AppError("Class section doesn't exists!", 400));	
			}
			let user = await Student.findOne({email});
			user = user || await Teacher.findOne({email});
			if(user) {
				return next(new AppError("Email already exists!", 400));	
			}
			user = await Student.create({
				name, email, password, roll_no, section: div,
			})
			div.students.push(user._id);
			await div.save();
			sendToken(user, res, 200, "Student user created successfully!");
		}
		else if(role == "teacher") {
			const {subject} = req.body;
			if(!subject) {
				return next(new AppError("All fields are required!", 400));	
			}
			let user = await Teacher.findOne({email});
			user = user || await Student.findOne({email});
			if(user) {
				return next(new AppError("Email already exists!", 400));	
			}
			user = await Teacher.create({
				name, email, password, subject,
			})
			sendToken(user, res, 200, "Teacher user created successfully!");	
		}
		else {
			return next(new AppError("Invalid role type!", 400));	
		}
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

export const login = async (req, res, next) => {
	try {
		const {email, password, role} = req.body;
		if(!email || !password || !role) {
			return next(new AppError("All fields are required!"));
		}
		if(role == "teacher") {
			const user = await Teacher.findOne({email}).select("+password");
			if(!user) {
				return next(new AppError("Invalid email or password!", 400));
			}
			const match = await user.comparePassword(password);
			if(!match) {
				return next(new AppError("Invalid email or password!", 400));	
			}
			sendToken(user, res, 200, "Logged in successfully!");
		}
		else if(role == "student") {
			const user = await Student.findOne({email}).select("+password");
			if(!user) {
				return next(new AppError("Invalid email or password!", 400));
			}
			const match = await user.comparePassword(password);
			if(!match) {
				return next(new AppError("Invalid email or password!", 400));	
			}
			sendToken(user, res, 200, "Logged in successfully!");
		}	
		else {
			return next(new AppError("Invalid role!", 400));	
		}
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

export const logout = async (req, res, next) => {
	try {
		res.status(201).cookie("token", "", {httpOnly: true, expires: new Date(Date.now())
		}).json({
			success: true,
			message: "Logged out successfully!"
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}


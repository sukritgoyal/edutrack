import {Teacher} from "../models/teacherModel.js";
import {Student} from "../models/studentModel.js"
import {Division} from "../models/divisionModel.js"
import {Lecture} from "../models/lectureModel.js"
import AppError from "../middlewares/error.js"

export const addLecture = async (req, res, next) => {
	try {
		const {time, section} = req.body;
		if(!time || !section) {
			return next(new AppError("All fields are required!", 400));	
		}	
		const division = await Division.findById(section);
		if(!division) {
			return next(new AppError("Section doesn't exists!", 400));
		}
		const user = await Teacher.findById(req.user._id);
		const isSection = user.sections.find(sec => sec._id.equals(division._id));
		if(!isSection) {
			user.sections.push(division);
		}
		division.time_table.push({time, teacher: user});
		await division.save();
		await user.save();
		return res.status(200).json({
			success: true,
			user,
			division,
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

export const complete = async(req, res, next) => {
	try {
		const {time, section} = req.body;
		if(!time || !section) {
			return next(new AppError("All fields are required!", 400));	
		}	
		const division = await Division.findById(section);
		if(!division) {
			return next(new AppError("Section doesn't exists!", 400));
		}
		const user = await Teacher.findById(req.user._id);
		const isSection = user.sections.find(sec => sec._id.equals(division._id));
		if(!isSection) {
			return next(new AppError("Teacher doesn't exists in this section!", 400));
		}
		const lect = await Lecture.create({teacher: user, section: division, time});
		user.lectures.completed.push(lect);
		division.lectures.push(lect);
		await user.save();
		await division.save();
		return res.status(200).json({
			success: true,
			user, 
			division
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

export const present = async(req, res, next) => {
	try {
		const {studentID, lectID} = req.body;
		if(!lectID || !studentID) {
			return next(new AppError("Please specify the lecture!", 400));		
		}
		const lecture = await Lecture.findById(lectID);
		if(!lecture) {
			return next(new AppError("Lecture doesn't exists!", 400));	
		}
		const user = await Teacher.findById(req.user._id);
		if(!lecture.teacher._id.equals(user._id)) {
			return next(new AppError("Lecture doesn't exists!!", 400));	
		}
		const student = await Student.findById(studentID);
		if(!student) {
			return next(new AppError("Student doesn't exists!", 400));
		}
		if(!lecture.section._id.equals(student.section._id)) {
			return next(new AppError("Student doesn't exists!!", 400));
		}
		const isPresent = student.lectures.attended.find(lect => lect._id.equals(lecture._id));
		if(isPresent)
			return res.status(200).json({success: true});
		const isAbsent = student.lectures.absent.find(lect => lect._id.equals(lecture._id));
		if (isAbsent) {
			student.lectures.absent.pull(lecture);
			lecture.absentees.pull(student);
		}
		student.lectures.attended.push(lecture);
		lecture.presentees.push(student);

		await student.save();
		await lecture.save();

		return res.status(200).json({
			success: true,
			student,
			lecture
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

export const absent = async(req, res, next) => {
	try {
		const {studentID, lectID} = req.body;
		if(!lectID || !studentID) {
			return next(new AppError("Please specify the lecture!", 400));		
		}
		const lecture = await Lecture.findById(lectID);
		if(!lecture) {
			return next(new AppError("Lecture doesn't exists!", 400));	
		}
		const user = await Teacher.findById(req.user._id);
		if(!lecture.teacher._id.equals(user._id)) {
			return next(new AppError("Lecture doesn't exists!!", 400));	
		}
		const student = await Student.findById(studentID);
		if(!student) {
			return next(new AppError("Student doesn't exists!", 400));
		}
		if(!lecture.section._id.equals(student.section._id)) {
			return next(new AppError("Student doesn't exists!!", 400));
		}
		const isAbsent = student.lectures.absent.find(lect => lect._id.equals(lecture._id));
		if(isAbsent)
			return res.status(200).json({success: true});
		const isPresent = student.lectures.attended.find(lect => lect._id.equals(lecture._id));
		if (isPresent) {
			student.lectures.attended.pull(lecture);
			lecture.presentees.pull(student);
		}
		student.lectures.absent.push(lecture);
		lecture.absentees.push(student);

		await student.save();
		await lecture.save();

		return res.status(200).json({
			success: true,
			student,
			lecture
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}
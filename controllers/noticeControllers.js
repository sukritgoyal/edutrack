import AppError from "../middlewares/error.js"
import {Teacher} from "../models/teacherModel.js"
import {Student} from "../models/studentModel.js"
import {Notice} from "../models/noticeModel.js"
import {Division} from  "../models/divisionModel.js"

export const addNotice = async(req, res, next) => {
	try {
		const {heading, content, to} = req.body;
		if(!heading || !content || !to) {
			return next(new AppError("All fields are required!", 400));
		}
		const user = await Teacher.findById(req.user._id);
		if(to == "student") {
			const {studentID} = req.body;
			if(!studentID) {
				return next(new AppError("Please mention the student id!", 400));		
			}
			const student = await Student.findById(studentID);
			if(!student) {
				return next(new AppError("Student doesn't exists!", 400));	
			}
			const condition = user.sections.find(sec => sec._id.equals(student.section._id));
			if(!condition) {
				return next(new AppError("Student doesn't exists!", 400));	
			}
			const notice = await Notice.create({heading, content, teacher: user});
			user.notices.push({notice: notice, to: "Student", student: student});
			student.notices.push(notice);
			await user.save();
			await student.save();
			// console.log(user);
			return res.status(200).json({
				success: true,
			});
		}
		else if(to == "section") {
			const {sectionID} = req.body;
			if(!sectionID) {
				return next(new AppError("Please mention the section id!", 400));		
			}
			const section = await Division.findById(sectionID);
			if(!section) {
				return next(new AppError("Section doesn't exists!", 400));	
			}
			const condition = user.sections.find(sec => sec._id.equals(section._id));
			if(!condition) {
				return next(new AppError("Section doesn't exists!", 400));	
			}
			const notice = await Notice.create({heading, content, teacher: user});
			user.notices.push({notice: notice, to: "Section", section: section});
			section.notices.push(notice);
			await user.save();
			await section.save();
			// console.log(user);
			return res.status(200).json({
				success: true,
				message: "Successfully posted!",
			});
		}
		else if(to == "all") {
			const notice = await Notice.create({heading, content, teacher: user});
			const sections = user.sections;
			sections.forEach(async function (sec) {
				const sect = await Division.findById(sec._id);
				sect.notices.push(notice);
				await sect.save();
			});
			user.notices.push({notice: notice, to: "All"});
			await user.save();
			// console.log(user);
			return res.status(200).json({
				success: true,
			})
		}
		else {
			return next(new AppError("Please specify a valid receiver!", 400));	
		}
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

export const individualNotices = async(req, res, next) => {
	try {
		const user = await Student.findById(req.user._id);
		let data = [];
		user.notices.forEach(async function (noticeID, ind) {
			const temp = {};
			const notice = await Notice.findById(noticeID);
			temp.heading = notice.heading;
			temp.content = notice.content;
			console.log(temp);
			data[ind] = temp;
			// console.log(data);
		})
		console.log(data);
		return res.status(200).json({
			success: true,
			data: data,
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}
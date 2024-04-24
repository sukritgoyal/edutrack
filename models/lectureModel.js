import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
	section: {
		type: mongoose.Schema.ObjectId,
		ref: "Division",
	},
	time: {
		type: String,
	},
	teacher: {
		type: mongoose.Schema.ObjectId,
		ref: "Teacher"
	},
	absentees: [{
		type: mongoose.Schema.ObjectId,
		ref: "Student",
	}],
	presentees: [{
		type: mongoose.Schema.ObjectId,
		ref: "Student",
	}],
})

export const Lecture = mongoose.model("Lecture", lectureSchema);
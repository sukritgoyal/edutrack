import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
	heading: {
		type: String,
		required: [true, "Please enter the heading!"],
	},
	content: {
		type: String,
		required: [true, "Please enter the heading!"],
	},
	teacher: {
		type: mongoose.Schema.ObjectId,
		ref: "Teacher"
	},
	postedOn: {
		type: Date,
		default: Date.now,
	}
})

export const Notice = mongoose.model("Notice", noticeSchema);
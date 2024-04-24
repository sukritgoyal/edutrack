import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema({
	section: {
		type: String,
		required: true,
	},
	students: [{
		type: mongoose.Schema.ObjectId,
		ref: "Student",
	}],
	time_table: [{
		time: {
			type: String
		},
		teacher: {
			type: mongoose.Schema.ObjectId,
			ref: "Teacher",
		}	
	}],
	lectures: [{
		type: mongoose.Schema.ObjectId,
		ref: "Lecture"
	}],
	notices: [{
		type: mongoose.Schema.ObjectId,
		ref: "Notice",
	}]
})

export const Division = mongoose.model("Division", divisionSchema);
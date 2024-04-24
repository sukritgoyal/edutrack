import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  roll_no: {
  	type: Number, 
  	required: [true, "Please enter roll no.!"],
    minLength: [1000000, "Enter a valid roll no.!"],
    maxLength: [9999999, "Enter a valid roll no.!"],
  },
  section: {
  	type: mongoose.Schema.ObjectId,
  	ref: "Division",
  	required: true,
  },
  lectures: {
  	  attended: [{
	  	type: mongoose.Schema.ObjectId,
	  	ref: "Lecture"
	  }],
	  absent: [{
	  	type: mongoose.Schema.ObjectId,
	  	ref: "Lecture"
	  }],	
  },
  notices: [{
    type: mongoose.Schema.ObjectId,
    ref: "Notice"
  }]
})


studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

studentSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export const Student = mongoose.model("Student", studentSchema);
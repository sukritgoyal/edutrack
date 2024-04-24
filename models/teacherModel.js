import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const teacherSchema = new mongoose.Schema({
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
  subject: {
  	type: String,
  	required: [true, "Please specify your course subject!"],
  },
  sections: [{
    	type: mongoose.Schema.ObjectId,
    	ref: "Division",
    }],
  lectures: {
	  completed: [{
	  	type: mongoose.Schema.ObjectId,
	  	ref: "Lecture"
	  }],
	  cancelled: [{
	  	type: mongoose.Schema.ObjectId,
	  	ref: "Lecture"
	  }],
  },
  notices: [{
    notice: {
      type: mongoose.Schema.ObjectId,
      ref: "Notice",
    },
    to: {
      type: String,
      enum: ["Student", "Section", "All"],
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Division",
    }
  }],
})


teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

teacherSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

teacherSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export const Teacher = mongoose.model("Teacher", teacherSchema);
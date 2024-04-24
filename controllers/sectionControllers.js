import {Division} from "../models/divisionModel.js";
import AppError from "../middlewares/error.js";

export const addDivision = async (req, res, next) => {
	try {
		const {section} = req.body;
		let div = await Division.findOne({section});
		if(div) {
			return next(new AppError("Section already exists!"))
		}
		div = await Division.create({section});
		return res.status(200).json({
			div,
			success: true,
			message: "Division created successfully!",
		})
	}
	catch(e) {
		return next(new AppError(e.message, 400));
	}
}

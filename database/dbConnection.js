import mongoose from "mongoose";

export const dbConnection = () => {
	mongoose.connect(process.env.MONGO_URI, {
		dbName: "EDUTRACK"
	}).then(() => {
		console.log("Database Connected!")
	}).catch((err) => {
		console.log(err);
	})
}
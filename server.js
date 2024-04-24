import app from "./App.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

app.listen(process.env.PORT, () => {
	console.log(`SERVER RUNNING ON ${process.env.PORT}`);
})
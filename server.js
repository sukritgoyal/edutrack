import app from "./App.js";

app.listen(process.env.PORT, () => {
	console.log(`SERVER RUNNING ON ${process.env.PORT}`);
})

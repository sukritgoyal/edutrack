import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRoutes.js"
import divRouter from "./routes/divRoutes.js"
import lectureRouter from "./routes/lectureRoutes.js"
import noticeRouter from "./routes/noticeRoutes.js"
import {dbConnection} from "./database/dbConnection.js"
import {errorMiddleware} from "./middlewares/error.js";

const app = express();
dotenv.config({path: "./config/config.env"});
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ['PUT', 'POST', 'GET', 'DELETE'],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "/tmp/",
}))

app.use("/api/v1/user", userRouter);
app.use("/api/v1/division", divRouter);
app.use("/api/v1/lecture", lectureRouter);
app.use("/api/v1/notice", noticeRouter);

dbConnection();

app.use(errorMiddleware);


export default app;
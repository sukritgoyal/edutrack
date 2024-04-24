import {isTeacher, isStudent} from "../middlewares/isAuth.js";
import {addNotice, individualNotices} from "../controllers/noticeControllers.js"
import express from "express";

const router = express.Router();

router.post("/add", isTeacher, addNotice);
router.get("/individual", isStudent, individualNotices);

export default router;


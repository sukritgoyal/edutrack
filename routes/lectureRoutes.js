import {addLecture, complete, present, absent} from "../controllers/lectureControllers.js";
import {isTeacher, isStudent} from "../middlewares/isAuth.js"

import express from "express";

const router = express.Router();

router.post("/add", isTeacher, addLecture);
router.post("/complete", isTeacher, complete);
router.post("/present", isTeacher, present);
router.post("/absent", isTeacher, absent);

export default router;
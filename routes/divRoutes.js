import express from "express";
import {addDivision} from "../controllers/sectionControllers.js";

const router = express.Router();

router.post("/add", addDivision);

export default router;
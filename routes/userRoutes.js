import express from "express";
import {signup, login, logout} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
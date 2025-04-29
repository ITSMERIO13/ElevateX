import express from "express";
import { signUp, verifyEmail, loginStudent, logoutStudent } from "../controllers/student.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/verify-email", verifyEmail);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

export default router;

import express from "express";
import { adminLogin, getAllTeams, getAllMentors, assignMentorToTeam, adminLogout, adminSignup, debugGetAllTeams, createTestTeam } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/teams", getAllTeams);
router.get("/debug-teams", debugGetAllTeams);
router.get("/mentors", getAllMentors);
router.post("/assign-mentor", assignMentorToTeam);
router.post("/create-test-team", createTestTeam);

export default router; 
import express from "express";
import { mentorSignUp, mentorLogin, mentorLogout, verifyMentorOTP, getAssignedTeams, getTeamGitHubStats, getAllTeamsGitHubStats } from "../controllers/mentor.controller.js";

const router = express.Router();

router.post("/signup", mentorSignUp);
router.post("/login", mentorLogin);
router.post("/logout", mentorLogout);
router.post("/verify-email", verifyMentorOTP);
router.get("/assigned-teams/:mentorId", getAssignedTeams);
router.get("/team-github-stats/:teamId", getTeamGitHubStats);
router.get("/all-teams-github-stats/:mentorId", getAllTeamsGitHubStats);

export default router;

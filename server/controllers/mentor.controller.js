import Mentor from "../models/mentor.model.js";
import bcrypt from "bcryptjs";
import { validationResult } from 'express-validator';
import generateTokenandSetcookie from "../utils/Generatejwt.js";
import sendEmail from "../utils/Sendmail.js";
import Team from "../models/Team.model.js";
import Project from "../models/project.model.js";
import GithubAPI from "../utils/GithubAPI.js";


// Mentor Signup
export const mentorSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, expertise, experience, bio, agreedToTerms } = req.body;

        if (confirmPassword !== password) 
            return res.status(400).json({ message: "Passwords do not match!" });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let mentor = await Mentor.findOne({ email });
        if (mentor) return res.status(400).json({ error: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

        const mentorPic = `https://avatar.iran.liara.run/username?username=[${firstName}+${lastName}]`;

        const newMentor = new Mentor({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            expertise,
            experience,
            bio,
            agreedToTerms,
            profilePic: mentorPic,
            isVerified: false,
            otp,
            otpExpiry,
        });

        const savedMentor = await newMentor.save();

        // 👉 Create a proper HTML content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Thanks for Signing Up, ${firstName}!</h2>
                <p>Welcome to our platform. Please use the following OTP to verify your account:</p>
                <h3 style="color: #2E86C1;">${otp}</h3>
                <p>This OTP will expire in <strong>15 minutes</strong>.</p>
                <p>If you didn't sign up, please ignore this email.</p>
                <br/>
                <p>Thanks,<br/>Team</p>
            </div>
        `;

        await sendEmail(email, "Verify Your Account", htmlContent);

        res.status(201).json({ success: true, message: "Mentor registered successfully. Please verify OTP.", email: savedMentor.email });
    } catch (error) {
        console.log("Error in mentor signup", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Mentor Login
export const mentorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const mentor = await Mentor.findOne({ email });
        if (!mentor) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        if (!mentor.isVerified) {
            return res.status(403).json({ error: "Please verify your account first." });
        }
        if (mentor.otp) {
            return res.status(403).json({ error: "Please verify your OTP first." });
        }

        const isMatch = await bcrypt.compare(password, mentor.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        generateTokenandSetcookie(mentor._id, res);
        res.status(200).json({
            success: true,
            mentor, 
            userType: "Mentor" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mentor Logout
export const mentorLogout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mentor OTP Verification
export const verifyMentorOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const mentor = await Mentor.findOne({ email });

        if (!mentor) return res.status(404).json({ error: "Mentor not found" });

        if (mentor.otp !== otp || mentor.otpExpiry < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }
        mentor.isVerified = true;
        mentor.otp = null;
        mentor.otpExpiry = null;
        await mentor.save();

        generateTokenandSetcookie(mentor._id, res);
        res.status(200).json({ status:true, mentor,message: "OTP verified successfully, mentor logged in.",userType: "Mentor" });   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Teams Assigned to a Mentor
export const getAssignedTeams = async (req, res) => {
    try {
        const { mentorId } = req.params;
        
        // Validate mentor ID
        if (!mentorId) {
            return res.status(400).json({ error: "Mentor ID is required" });
        }
        
        // Check if mentor exists
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }
        
        // Find teams where this mentor is assigned
        const teams = await Team.find({ mentor: mentorId })
            .populate("owner", "firstName lastName name email profilePic")
            .populate("members", "firstName lastName name email profilePic")
            .populate("project")
            .sort({ updatedAt: -1 });
        
        res.status(200).json(teams);
    } catch (error) {
        console.error("Error fetching assigned teams:", error);
        res.status(500).json({ error: "Failed to fetch assigned teams" });
    }
};

// Get GitHub Repository Stats for Team Project
export const getTeamGitHubStats = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { githubToken } = req.query; // Optional token for private repos
        
        // Validate team ID
        if (!teamId) {
            return res.status(400).json({ error: "Team ID is required" });
        }
        
        // Find the team and its project
        const team = await Team.findById(teamId).populate("project");
        
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        
        if (!team.project) {
            return res.status(404).json({ error: "Team does not have a project" });
        }
        
        if (!team.project.githubRepo) {
            return res.status(404).json({ error: "Team project does not have a GitHub repository" });
        }
        
        // Get GitHub stats for the repository
        try {
            const stats = await GithubAPI.getRepositoryActivitySummary(team.project.githubRepo, githubToken);
            
            console.log('GitHub Stats Response for Team:', teamId);
            console.log(JSON.stringify(stats, null, 2));
            
            res.status(200).json({
                teamId: team._id,
                projectId: team.project._id,
                repositoryUrl: team.project.githubRepo,
                stats
            });
        } catch (githubError) {
            console.error("GitHub API error:", githubError);
            
            // Send a partial response with repository URL but without stats
            // This allows the frontend to still display some information
            res.status(200).json({
                teamId: team._id,
                projectId: team.project._id,
                repositoryUrl: team.project.githubRepo,
                stats: null,
                error: "GitHub API error: " + githubError.message,
                fallbackStats: {
                    name: team.project.title || "Unknown",
                    fullName: team.project.githubRepo.split('/').slice(-2).join('/'),
                    language: "Unknown",
                    updatedAt: team.updatedAt
                }
            });
        }
    } catch (error) {
        console.error("Error fetching team GitHub stats:", error);
        res.status(500).json({ error: "Failed to fetch team GitHub stats" });
    }
};

// Get GitHub Stats for All Teams Assigned to a Mentor
export const getAllTeamsGitHubStats = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { githubToken } = req.query; // Optional token for private repos
        
        // Validate mentor ID
        if (!mentorId) {
            return res.status(400).json({ error: "Mentor ID is required" });
        }
        
        // Check if mentor exists
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }
        
        // Find teams where this mentor is assigned
        const teams = await Team.find({ mentor: mentorId })
            .populate({
                path: "project",
                select: "title description githubRepo"
            })
            .select("_id name teamCode project updatedAt");
        
        // Filter teams that have a project with a GitHub repository
        const teamsWithGithub = teams.filter(team => 
            team.project && team.project.githubRepo
        );
        
        if (teamsWithGithub.length === 0) {
            return res.status(200).json({ teams: [] });
        }
        
        // Fetch GitHub stats for each team's repository
        const teamStats = await Promise.all(
            teamsWithGithub.map(async (team) => {
                try {
                    const stats = await GithubAPI.getRepositoryActivitySummary(
                        team.project.githubRepo, 
                        githubToken
                    );
                    
                    console.log(`GitHub Stats Response for Team ${team._id} (${team.name}):`);
                    console.log(JSON.stringify(stats, null, 2));
                    
                    return {
                        teamId: team._id,
                        teamName: team.name,
                        teamCode: team.teamCode,
                        projectId: team.project._id,
                        projectTitle: team.project.title,
                        repositoryUrl: team.project.githubRepo,
                        stats
                    };
                } catch (error) {
                    console.error(`Error fetching GitHub stats for team ${team._id}:`, error);
                    return {
                        teamId: team._id,
                        teamName: team.name,
                        teamCode: team.teamCode,
                        projectId: team.project._id,
                        projectTitle: team.project.title,
                        repositoryUrl: team.project.githubRepo,
                        error: error.message,
                        stats: null,
                        fallbackStats: {
                            name: team.project.title || "Unknown",
                            fullName: team.project.githubRepo.split('/').slice(-2).join('/'),
                            language: "Unknown",
                            updatedAt: team.updatedAt
                        }
                    };
                }
            })
        );
        
        res.status(200).json({ teams: teamStats });
    } catch (error) {
        console.error("Error fetching GitHub stats for mentor teams:", error);
        res.status(500).json({ error: "Failed to fetch GitHub stats" });
    }
};

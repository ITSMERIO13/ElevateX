import Admin from "../models/admin.model.js";
import Team from "../models/Team.model.js";
import Mentor from "../models/mentor.model.js";
import bcrypt from "bcryptjs";
import generateTokenandSetcookie from "../utils/Generatejwt.js";
import mongoose from "mongoose";

// Admin Signup - can only be used once when no admins exist
export const adminSignup = async (req, res) => {
    try {
        const { name, email, password, setupCode } = req.body;
        
        // Verify setup code - this should be a secure code only you know
        const correctSetupCode = process.env.ADMIN_SECURITY_CODE || "initialsetup123";
        if (setupCode !== correctSetupCode) {
            return res.status(401).json({ error: "Invalid setup code" });
        }
        
        // Check if any admin already exists
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(403).json({ error: "Admin already exists. This endpoint can only be used once." });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new admin with hashed password
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });
        
        await newAdmin.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Admin account created successfully" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password, code } = req.body;
        
        const securityCode = process.env.ADMIN_SECURITY_CODE || "admin123";
        if (code !== securityCode) {
            return res.status(401).json({ error: "Invalid security code" });
        }
        
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        generateTokenandSetcookie(admin._id, res);
        res.status(200).json({
            success: true,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            userType: "admin"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminLogout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ status: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

export const getAllTeams = async (req, res) => {
    try {
        // Find all teams and populate related data
        const teams = await Team.find()
            .populate("owner", "firstName lastName name email profilePic")
            .populate("members", "firstName lastName name email profilePic")
            .populate("mentor", "firstName lastName name email profilePic expertise")
            .sort({ updatedAt: -1 }); // Sort by most recently updated
        
        if (teams.length === 0) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ error: "Failed to fetch teams. Please try again." });
    }
};

export const getAllMentors = async (req, res) => {
    try {
        // Find all verified mentors, exclude sensitive information
        const mentors = await Mentor.find({ isVerified: true })
            .select('firstName lastName email expertise experience bio profilePic')
            .sort({ firstName: 1 }); // Sort by first name
        
        if (mentors.length === 0) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(mentors);
    } catch (error) {
        console.error("Error fetching mentors:", error);
        res.status(500).json({ error: "Failed to fetch mentors. Please try again." });
    }
};

export const assignMentorToTeam = async (req, res) => {
    try {
        const { teamId, mentorId } = req.body;
        
        // Find the team by ID
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        
        // Find the mentor by ID
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }
        
        // Verify that the mentor is verified
        if (!mentor.isVerified) {
            return res.status(400).json({ error: "Mentor is not verified" });
        }
        
        // Assign mentor to the team
        team.mentor = mentorId;
        await team.save();
        
        // Return updated team data with populated mentor
        const updatedTeam = await Team.findById(teamId)
            .populate("owner", "firstName lastName name email profilePic")
            .populate("members", "firstName lastName name email profilePic")
            .populate("mentor", "firstName lastName name email profilePic");
        
        res.status(200).json({ 
            success: true, 
            message: "Mentor assigned successfully",
            team: updatedTeam
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Debug function to test database connection and team retrieval
export const debugGetAllTeams = async (req, res) => {
    try {
        console.log("Attempting to query Team collection...");
        
        // Simple query without population
        const teamsCount = await Team.countDocuments();
        console.log("Total teams count:", teamsCount);
        
        // Get raw team data
        const rawTeams = await Team.find().lean();
        console.log("Raw teams data:", JSON.stringify(rawTeams, null, 2));
        
        // Find all teams and populate related data
        const teams = await Team.find()
            .populate("owner", "firstName lastName name email profilePic")
            .populate("members", "firstName lastName name email profilePic")
            .populate("mentor", "firstName lastName name email profilePic expertise");
        
        console.log("Teams found:", teams.length);
        
        res.status(200).json({
            count: teams.length,
            rawCount: teamsCount,
            teams: teams
        });
    } catch (error) {
        console.error("Debug error fetching teams:", error);
        res.status(500).json({ 
            error: "Debug Error: " + error.message,
            stack: error.stack
        });
    }
};

// Create a test team for debugging
export const createTestTeam = async (req, res) => {
    try {
        // Step 1: Find a student to be the owner (first student in the database)
        const student = await mongoose.model('Student').findOne();
        
        if (!student) {
            return res.status(404).json({ error: "No students found to create test team" });
        }
        
        console.log("Found student for test team:", student._id);
        
        // Step 2: Generate a random team code
        const teamCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Step 3: Create the team
        const team = new Team({
            name: "Test Team " + Date.now(),
            teamCode,
            tagline: "This is a test team",
            description: "Created for testing the admin dashboard",
            owner: student._id,
            members: [student._id]
        });
        
        await team.save();
        console.log("Test team created:", team);
        
        // Step 4: Update the student to be part of this team
        student.team = team._id;
        await student.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Test team created successfully",
            team
        });
    } catch (error) {
        console.error("Error creating test team:", error);
        res.status(500).json({ error: error.message });
    }
}; 
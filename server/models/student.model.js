import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    semester: { type: String, required: true },
    agreedToTerms: { type: Boolean, required: true },
    profilePic: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },

    // Team-related fields
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null }, 
    teamRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], 
}, { timestamps: true });

const Student = mongoose.model("Student", StudentSchema);
export default Student;

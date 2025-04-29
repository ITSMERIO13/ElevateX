import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expertise: { type: [String], required: true }, 
    experience: { type: Number, required: true }, 
    bio: { type: String, required: true }, 
    agreedToTerms: { type: Boolean, required: true },
    profilePic: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
}, { timestamps: true });

const Mentor = mongoose.model("Mentor", MentorSchema);
export default Mentor;

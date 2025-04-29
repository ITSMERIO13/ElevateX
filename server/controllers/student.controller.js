import Student from "../models/student.model.js";
import bcrypt from "bcryptjs";
import generateTokenandSetcookie from "../utils/Generatejwt.js";
import sendEmail from "../utils/Sendmail.js";

// Email Template Function
const getOtpEmailTemplate = (name, otp) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
          padding: 40px;
        }
        h2 {
          color: #333333;
        }
        p {
          color: #555555;
          font-size: 16px;
          line-height: 1.5;
        }
        .otp-code {
          font-size: 28px;
          color: #007BFF;
          font-weight: bold;
          margin: 20px 0;
          background-color: #f1f3f5;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          letter-spacing: 2px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Thanks for Signing Up, ${name}!</h2>
        <p>Welcome! To complete your registration, please verify your account using the OTP code below:</p>

        <div class="otp-code">${otp}</div>

        <p>This code is valid for <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
        
        <p>Thanks,<br>The ExevateX Team</p>

        <div class="footer">
          © 2025 ExevateX. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;

export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, semester, agreedToTerms, gender } = req.body;
        
        if (confirmPassword !== password) 
            return res.status(400).json({ status: false, message: "Passwords do not match" });

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) return res.status(400).json({ status: false, error: "Email already registered" });

        const boyPic = `https://avatar.iran.liara.run/public/boy?username=${firstName}`;
        const girlPic = `https://avatar.iran.liara.run/public/girl?username=${firstName}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            semester,
            agreedToTerms,
            profilePic: gender === 'Male' ? boyPic : girlPic,
            otp,
            otpExpiry,
        });

        await newStudent.save();

        const htmlContent = getOtpEmailTemplate(firstName, otp);
        await sendEmail(email, "Verify Your Account", htmlContent);

        res.status(201).json({ status: true, email, message: "OTP sent to email. Please verify your account." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

export const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });

        if (!student) return res.status(401).json({ status: false, error: "Invalid email or password" });
        if (!student.isVerified) return res.status(401).json({ status: false, error: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ status: false, error: "Invalid email or password" });

        generateTokenandSetcookie(student._id, res);
        res.status(200).json({ status: true, student, userType: "Student" });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

export const logoutStudent = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ status: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const student = await Student.findOne({ email });

        if (!student) return res.status(400).json({ status: false, error: "Student not found" });
        if (student.isVerified) return res.status(400).json({ status: false, error: "Email already verified" });

        if (student.otp !== otp || student.otpExpiry < Date.now()) {
            return res.status(400).json({ status: false, error: "Invalid or expired OTP" });
        }

        student.isVerified = true;
        student.otp = null;
        student.otpExpiry = null;
        await student.save();

        res.status(200).json({ status: true, student, message: "Email verified successfully", userType: "Student" });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

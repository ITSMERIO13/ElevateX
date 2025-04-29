import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (email, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD, 
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;

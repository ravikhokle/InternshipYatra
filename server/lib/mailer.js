const nodemailer = require('nodemailer');

const getTransporter = () => {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS || EMAIL_PASS === 'your_gmail_app_password') {
        throw new Error(
            'Email is not configured. Set EMAIL_USER and EMAIL_PASS (Gmail App Password) in server/.env'
        );
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
};

/**
 * Send an OTP email to the user
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"InternshipYatra" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your Password Reset OTP — InternshipYatra',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin-bottom: 8px;">InternshipYatra</h2>
            <p style="color: #374151; font-size: 16px;">You requested a password reset. Use the OTP below to verify your identity.</p>

            <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your One-Time Password</p>
                <h1 style="letter-spacing: 16px; color: #111827; font-size: 40px; margin: 12px 0;">${otp}</h1>
                <p style="margin: 0; color: #ef4444; font-size: 13px;">⏱ Expires in 10 minutes</p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} InternshipYatra · Made with 🖤 by Ravi Khokle</p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendSignupOTPEmail = async (toEmail, otp, name) => {
    const mailOptions = {
        from: `"InternshipYatra" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Verify your email — InternshipYatra Signup',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin-bottom: 8px;">InternshipYatra</h2>
            <p style="color: #374151; font-size: 16px;">Hi ${name}, welcome! Use the OTP below to verify your email and complete your registration.</p>

            <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Verification Code</p>
                <h1 style="letter-spacing: 16px; color: #111827; font-size: 40px; margin: 12px 0;">${otp}</h1>
                <p style="margin: 0; color: #ef4444; font-size: 13px;">⏱ Expires in 10 minutes</p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">If you did not create an account, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} InternshipYatra · Made with 🖤 by Ravi Khokle</p>
        </div>
        `,
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendSignupOTPEmail };

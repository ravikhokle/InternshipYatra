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

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
};

const sendContactEmail = async ({ name, email, subject, message }) => {
    const to = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
    const mailSubject = subject?.trim() || 'Contact from InternshipYatra';

    const mailOptions = {
        from: `"InternshipYatra" <${process.env.EMAIL_USER}>`,
        to,
        replyTo: email,
        subject: `[Contact] ${mailSubject}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin-bottom: 8px;">New Contact Message</h2>
            <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">You received a message from the InternshipYatra contact form.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; width: 100px;">Name</td>
                    <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Email</td>
                    <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Subject</td>
                    <td style="padding: 8px 0;">${mailSubject}</td>
                </tr>
            </table>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 20px;">
                <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 600;">Message</p>
                <p style="margin: 0; color: #111827; font-size: 15px; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
        </div>
        `,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${mailSubject}\n\n${message}`,
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
};

const sendContactThankYouEmail = async ({ name, email, subject }) => {
    const mailSubject = subject?.trim() || 'your message';

    const mailOptions = {
        from: `"InternshipYatra" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting InternshipYatra',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin-bottom: 8px;">InternshipYatra</h2>
            <p style="color: #374151; font-size: 16px;">Hi ${name},</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out to us. We have received your message regarding <strong>${mailSubject}</strong>.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Our team will review it and get in touch with you shortly — usually within 1–2 business days.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                If your query is urgent, you can also reply directly to this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} InternshipYatra · All rights reserved.</p>
        </div>
        `,
        text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message regarding "${mailSubject}".\n\nOur team will review it and get in touch with you shortly — usually within 1–2 business days.\n\nIf your query is urgent, you can also reply directly to this email.`,
    };

    const transporter = getTransporter();
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

module.exports = { sendOTPEmail, sendSignupOTPEmail, sendContactEmail, sendContactThankYouEmail };

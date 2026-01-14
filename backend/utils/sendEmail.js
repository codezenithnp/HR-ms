import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    console.log(`[Email Debug] Attempting to send email to: ${options.email}`);
    console.log(`[Email Debug] SMTP Host: ${process.env.SMTP_HOST}`);

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        // Verify connection configuration
        await transporter.verify();
        console.log('[Email Debug] Server is ready to take our messages');

        // Prepare email message
        const message = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: options.html // could add HTML support later
        };

        // Send email
        const info = await transporter.sendMail(message);

        console.log('[Email Debug] Message sent: %s', info.messageId);
    } catch (error) {
        console.error('[Email Debug] Error sending email:', error);
        throw error; // Re-throw to be caught by controller
    }
};

export default sendEmail;

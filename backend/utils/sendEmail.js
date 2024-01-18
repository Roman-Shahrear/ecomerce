const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        //if normally gmail service not work then you add some property like bellow
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email sending failed", error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;

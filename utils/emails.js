const nodemailer = require('nodemailer')
const { options } = require('../app')
const { text } = require('express')


const sendEmail = async (options) => {
    // CREATE TRANSPORT
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    })

    // MAIL OPTIONS
    const mailOptions = {
        from: 'Thanh Tin <tinnguyenit04@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    // SEND EMAIL
        await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;

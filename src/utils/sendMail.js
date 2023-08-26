import nodemailer from 'nodemailer'
import config from '../config/config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_USER_APP,
        pass: config.GMAIL_PASS_APP
    }
})

export default async (email, subject, html) => {
    return await transporter.sendMail({
        from: '<DecorateMe>',
        to: email,
        subject: subject,
        html: html
    })
}
import formData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";
dotenv.config();
const mailgun = new Mailgun(formData);
const DOMAIN = "sandbox75bfd4bf20ec4e3da43ae880a816e29b.mailgun.org";
const mg = mailgun.client({
  username: "Anoymous",
  key: process.env.MAILGUN_API_KEY,
});

export const sendEmail = (reciever, text, html, subject) => {
  const emailData = {
    from: "Ipress <me@sandbox75bfd4bf20ec4e3da43ae880a816e29b.mailgun.org>",
    to: "namitarastogimwn@gmail.com",
    subject: subject || "USER UPDATED",
    text: text || "",
    html: html || "",
  };
  // send the email data
  mg.messages
    .create(DOMAIN, emailData)
    .then(() => {
      console.log("email has been sent");
    })
    .catch((err) => {
      throw new Error(err);
      console.log("Mailgun error ", err);
    });
};

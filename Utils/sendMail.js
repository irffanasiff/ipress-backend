import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';
dotenv.config();
const mailgun = new Mailgun(formData);
const DOMAIN = 'sandbox75bfd4bf20ec4e3da43ae880a816e29b.mailgun.org';
const mg = mailgun.client({
  username: 'Anoymous',
  key: process.env.MAILGUN_API_KEY,
});

export const sendEmail = (reciever, template, subject, data) => {
  const emailData = {
    from: 'Ipress <me@sandbox75bfd4bf20ec4e3da43ae880a816e29b.mailgun.org>',
    to: 'namitarastogimwn@gmail.com',
    subject: subject || 'USER UPDATED',
    template: template,
    't:variables': JSON.stringify({
      ...data,
    }),
  };
  // send the email data
  mg.messages
    .create(DOMAIN, emailData)
    .then((res) => {
      console.log('email has been sent');
      console.log(res);
    })
    .catch((err) => {
      throw new Error(err);
      console.log('Mailgun error ', err);
    });
};

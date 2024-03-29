import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';
dotenv.config();
const mailgun = new Mailgun(formData);
const DOMAIN = 'sandboxa048f5567cf3421b9f927ddcf3d8bc72.mailgun.org';
const mg = mailgun.client({
  username: 'Anoymous',
  key: process.env.MAILGUN_API_KEY,
});

export const sendEmail = (reciever, template, subject, data) => {
  let emailData = {
    from: 'Ipress <me@sandboxa048f5567cf3421b9f927ddcf3d8bc72.mailgun.org>',
    to: reciever || 'namitarastogimwn@gmail.com',
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

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
  let emailData = {
    from: 'Ipress <me@sandbox75bfd4bf20ec4e3da43ae880a816e29b.mailgun.org>',
    to: 'namitarastogimwn@gmail.com',
    subject: subject || 'USER UPDATED',
    template: template,
    't:variables': JSON.stringify({
      ...data,
    }),
  };

  /* var addB64File = function (filename, b64) {
    if (!filename || !b64) {
      return;
    }

    var pos = b64.indexOf('base64,');
    if (pos !== -1) {
      b64 = b64.substr(pos + 7);
    }
    var buf = new Buffer(b64, 'base64');
    emailData.img = buf;
  };
  if (data.img) addB64File('img', data.img);
  console.log(emailData); */
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

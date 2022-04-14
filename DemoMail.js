const API_KEY = '766d4227ecb2e2497fe84ff8512161ca-e2e3d8ec-5e44bc90';
const DOMAIN = 'irfanasif.me';

import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

const messageData = {
  from: 'Excited User',
  to: 'hashtag.irfan@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
};

client.messages
  .create(DOMAIN, messageData)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendMail(Name: any, Email: any, Id: any) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'dvdhorvitz@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: 'dvdhorvitz@gmail.com',
      to: 'dzh2205@gmail.com',
      subject: 'New Webmaster Added',
      text: `A new webmaster has been added:\n\nName: ${Name}\nEmail: ${Email}\nId: ${Id}`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
  } catch (error) {
    console.log('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}




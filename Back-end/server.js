require('dotenv').config()
const { dbConnection } = require('./database')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//Third party parsing tools location
app.use(express.json())
app.use(bodyParser.json())
//Enabled CORS for specific routes and options
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173']; // Add other origins as needed for full deployment later on
  const requestOrigin = req.headers.origin;
  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});


//Connecting to Users MongoDB database
let database
app.listen(3000, async() => {
  console.log(`Server is running on port 3000`)
  try {
    database = await dbConnection()
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Error connecting to MongoDB', err.message)
  }
})

//getting projects information to push to client frontend page
app.get('/project', async(req, res) => {
  try {
    const coll = database.collection('projects')
    const project = await coll.find().toArray()
    console.log('projects:', project)
    res.json(project)
  } catch (err) {
    console.error('Error fetching documents:', err.message)
    res.status(500).json()
  }
})

// This section will go through the Google OAuth2.0 process sending the appropriate credentials and requesting a Access_token and Refresh_token
// The Refresh_token will be stored in env file and will look to see if one is already available if so it will use the Refresh_token to request a new Access_token
// After verification the nodemailer will collect all information for sending out the email and will send a new request to the scoped google api
// If the credentials and scope match permission is granted and the email will be sent
const { google } = require('googleapis')
const nodemailer = require('nodemailer')
const fs = require('fs')

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// If refresh token is available, set it in OAuth2 client
if (process.env.REFRESH_TOKEN) {
  oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
}

// Generate URL for OAuth 2.0 authorization
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://mail.google.com/',
});

// Redirect user to auth URL to authorize the app
app.get('/authorize', (req, res) => {
  res.redirect(authUrl)
});

// OAuth 2.0 callback URL to exchange authorization code for tokens
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  console.log('from google:', code)
  const { tokens } = await oauth2Client.getToken(code)
  console.log(tokens)

  process.env.REFRESH_TOKEN = tokens.refresh_token
  oauth2Client.setCredentials(tokens)
  res.send('Authorization successful. You can now send emails.')
});

// Route to handle form submission and send email
app.post('/send-email', async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ferris.portfolio.backend@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: oauth2Client.credentials.refresh_token,
        accessToken: oauth2Client.credentials.access_token,
      },
    });

    // Read the HTML file
    const htmlEmail = fs.readFileSync('response.html', 'utf8')

    await transporter.sendMail({
      from: 'ferris.portfolio.backend@gmail.com',
      to: 'ferris.chang.f@gmail.com',
      subject: subject,
      text: message + '\n' + email,
    });

    await transporter.sendMail({
      from: 'ferris.portfolio.backend@gmail.com',
      to: email,
      subject: 'Re: Ferris Portfolio',
      text: htmlEmail
    })

    res.status(200).send('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
});

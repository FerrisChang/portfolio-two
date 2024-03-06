require('dotenv').config()
const { ObjectId } = require('mongodb')
const { dbConnection } = require('./database')
const express = require('express')
const app = express()

//Third party parsing tools location
app.use(express.json())

//Enabled CORS for specific routes and options
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173'] //will add other origins as needed for full deployment later on
  const requestOrigin = req.headers.origin

  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return;
  }
  next()
})

//Connecting to Users MongoDB database
let database
app.listen(3000, async() => {
  console.log(`Server is running on port ${3000}`)
  try {
    database = await dbConnection()
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Error connecting to MongoDB', err.message)
  }
})

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
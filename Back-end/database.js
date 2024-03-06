const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config();
const dbURL = process.env.MONGO_DATABASE_ADDRESS;

async function dbConnection() {
  const client = new MongoClient(dbURL, 
    {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    })

  try {
    await client.connect()
    const data = client.db('backend')
    console.log("Successfully connected to (backend db) MongoDB")
    return data
  } catch (err) {
    console.log('Error connecting to MongoDB: ', err.message)
    throw err
  }
}

module.exports = { dbConnection }
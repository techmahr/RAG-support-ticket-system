import dotenv from 'dotenv'

// Load the .env file into process.env
dotenv.config()

// Collect all environment variables we need
const env = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    pineconeApiKey: process.env.PINECONE_API_KEY,
    pineconeIndex: process.env.PINECONE_INDEX,
    mongodbUri: process.env.MONGODB_URI,
    port: process.env.PORT || 3000,
}

// Check if any required key is missing
// If missing, stop the app immediately with a clear error

// Add mongodbUri to required keys
const requiredKeys = ['geminiApiKey', 'pineconeApiKey', 'pineconeIndex', 'mongodbUri']

for (const key of requiredKeys) {
    if (!env[key]) {
        console.error(`❌ Missing required environment variable: ${key}`)
        process.exit(1) // Stop the app
    }
}

console.log('✅ Environment variables loaded successfully')

export default env
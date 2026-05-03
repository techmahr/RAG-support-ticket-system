import mongoose from 'mongoose'
import env from './env.js'

// ─────────────────────────────────────────
// Connect to MongoDB Atlas
// ─────────────────────────────────────────
export async function connectDB() {
    try {
        console.log('🔄 Connecting to MongoDB...')

        await mongoose.connect(env.mongodbUri)

        console.log('✅ MongoDB connected successfully!')
        console.log(`📦 Database: ${mongoose.connection.name}`)

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message)
        process.exit(1) // Stop app if DB connection fails
    }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB error:', error.message)
})
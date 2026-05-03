import mongoose from 'mongoose'

// ─────────────────────────────────────────
// Schema — defines the shape of our data
// ─────────────────────────────────────────
const ticketSchema = new mongoose.Schema(
    {
        // The ticket submitted by the user
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            default: 'General',
            trim: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'], // Only these values allowed
            default: 'medium',
        },

        // Session ID for conversation memory
        sessionId: {
            type: String,
            required: true,
        },

        // AI analysis result
        analysis: {
            suggestion: String,
            steps: [String], // Array of strings
            confidence: Number,
            disclaimer: String,
            basedOn: [String], // Array of ticket IDs
        },

        // Similar tickets found by Pinecone
        similarTickets: [
            {
                ticketId: String,
                title: String,
                category: String,
                similarityScore: Number,
                resolution: String,
            },
        ],
    },
    {
        // Automatically add createdAt and updatedAt fields
        timestamps: true,
    }
)

// Create and export the model
// mongoose.model('Ticket', ticketSchema) creates a 'tickets' collection
export default mongoose.model('Ticket', ticketSchema)
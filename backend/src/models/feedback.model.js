import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
    {
        // Reference to the session/ticket
        ticketId: {
            type: String,
            required: true,
        },

        // Was the suggestion helpful?
        helpful: {
            type: Boolean,
            required: true,
        },

        // Optional comment from user
        comment: {
            type: String,
            default: null,
            trim: true,
        },

        // Category of the ticket for stats filtering
        category: {
            type: String,
            default: 'General',
        },
    },
    {
        timestamps: true, // Adds createdAt, updatedAt automatically
    }
)

export default mongoose.model('Feedback', feedbackSchema)
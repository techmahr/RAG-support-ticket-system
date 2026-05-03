import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { retrieveSimilarTickets } from './retriever.js'
import env from '../config/env.js'

// ─────────────────────────────────────────
// STEP 1 — Initialize Gemini LLM
// ─────────────────────────────────────────
// This is different from the embedding model
// Embedding model  → converts text to vectors (for search)
// LLM (this one)   → understands context and generates answers
const llm = new ChatGoogleGenerativeAI({
    apiKey: env.geminiApiKey,
    model: 'gemini-2.5-flash',
    temperature: 0.2, // Low temperature = more focused, consistent answers
    // High temperature = more creative, random answers
    // For support suggestions we want consistent, not creative
})

// ─────────────────────────────────────────
// STEP 2 — Build the prompt template
// ─────────────────────────────────────────
// This is the instruction we give Gemini
// {newTicket} and {similarTickets} are placeholders
// filled in at runtime with actual data
const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert support ticket assistant. 
Your job is to analyze a new support ticket and suggest a solution 
based on similar past resolved tickets.

NEW TICKET:
{newTicket}

SIMILAR PAST RESOLVED TICKETS:
{similarTickets}

Based on the similar tickets above, provide:
1. A clear solution suggestion for the new ticket
2. Step by step resolution steps
3. A confidence score (0-100) based on how similar the past tickets are

IMPORTANT RULES:
- Only suggest solutions based on the similar tickets provided
- If similar tickets are not relevant enough, say so honestly
- Always end with this disclaimer: "Please verify this solution with your technical team before applying."
- Format your response as JSON with this exact structure:
{{
  "suggestion": "brief one line summary of the solution",
  "steps": ["step 1", "step 2", "step 3"],
  "confidence": 85,
  "disclaimer": "Please verify this solution with your technical team before applying.",
  "basedOn": ["T-1001", "T-1002"]
}}
`)

// ─────────────────────────────────────────
// STEP 3 — Output parser
// ─────────────────────────────────────────
// Gemini returns a Message object
// StringOutputParser extracts just the text from it
const outputParser = new StringOutputParser()

// ─────────────────────────────────────────
// STEP 4 — Build the chain
// ─────────────────────────────────────────
// The pipe operator (|) connects steps together:
// prompt → llm → outputParser
// Output of each step becomes input of next step
const chain = promptTemplate.pipe(llm).pipe(outputParser)

// ─────────────────────────────────────────
// STEP 5 — Conversation memory
// ─────────────────────────────────────────
// Simple in-memory store for chat history
// Stores last 10 messages per session
const conversationHistory = new Map()

// ─────────────────────────────────────────
// STEP 6 — Main analyze function
// ─────────────────────────────────────────
export async function analyzeTicket(ticketText, sessionId = 'default') {
    try {
        console.log('\n🤖 Analyzing ticket...')

        // Get similar tickets from Pinecone
        const similarTickets = await retrieveSimilarTickets(ticketText, 3)

        // Format similar tickets into readable text for the prompt
        const similarTicketsText = similarTickets
            .map((ticket, index) => `
        Past Ticket ${index + 1} (${ticket.similarityScore}% similar):
        ID: ${ticket.ticketId}
        Title: ${ticket.title}
        Category: ${ticket.category}
        Resolution: ${ticket.resolution}
      `).join('\n---\n')

        // Get conversation history for this session
        const history = conversationHistory.get(sessionId) || []

        // Build the full ticket text including conversation history
        // This is how we give Gemini memory of previous messages
        const fullTicketText = history.length > 0
            ? `Previous conversation:\n${history.join('\n')}\n\nNew message: ${ticketText}`
            : ticketText

        console.log('📤 Sending to Gemini...')

        // Run the chain — this sends everything to Gemini
        const response = await chain.invoke({
            newTicket: fullTicketText,
            similarTickets: similarTicketsText,
        })

        // ─────────────────────────────────────
        // STEP 7 — Parse Gemini's response
        // ─────────────────────────────────────
        // Gemini returns JSON as a string
        // We need to parse it into a JavaScript object
        // Sometimes Gemini wraps JSON in markdown code blocks
        // so we clean that up first
        const cleanedResponse = response
            .replace(/```json/g, '')  // remove ```json
            .replace(/```/g, '')      // remove ```
            .trim()

        const parsedResponse = JSON.parse(cleanedResponse)

        // Update conversation history
        history.push(`User: ${ticketText}`)
        history.push(`Assistant: ${parsedResponse.suggestion}`)

        // Keep only last 10 messages to avoid token limits
        if (history.length > 10) {
            history.splice(0, 2) // remove oldest pair
        }

        conversationHistory.set(sessionId, history)

        console.log('✅ Analysis complete!')

        // Return final response with similar tickets included
        return {
            success: true,
            analysis: parsedResponse,
            similarTickets: similarTickets,
        }

    } catch (error) {
        console.error('❌ Analysis failed:', error.message)
        throw error
    }
}

// Clear conversation history for a session
export function clearHistory(sessionId = 'default') {
    conversationHistory.delete(sessionId)
    console.log(`🗑️ Cleared history for session: ${sessionId}`)
}
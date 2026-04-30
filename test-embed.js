import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import dotenv from 'dotenv'
dotenv.config()

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'gemini-embedding-001',
})

const result = await embeddings.embedQuery('test ticket about login issue')
console.log('Dimensions:', result.length)
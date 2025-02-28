import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

if (!process.env.API_KEY) {
    throw new Error('Please setup your API key');
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default model;

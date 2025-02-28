import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import * as fs from 'fs';
config();

// Check for API key
if (!process.env.API_KEY) {
    throw new Error('Gemini API keys are not configured');
}

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to read CSV data
function readCSVData() {
    try {
        return fs.readFileSync('./lib/input.csv', 'utf-8');
    } catch (err) {
        console.error('Error reading CSV file:', err);
        process.exit(1);
    }
}

// Function to create or update cache
async function createOrUpdateCache() {
    const csvData = readCSVData();
    console.log('CSV data imported successfully');

    const cacheContent = await genAI.caching.CachedContent.create({
        model: "gemini-1.5-flash",
        name: "renewable_energy_forecast_cache",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `You have to predict data based on the following CSV for renewable energy forecasting: ${csvData}`
                    }
                ]
            }
        ],
        ttl: 9000 // Time to live in seconds (150 minutes)
    });

    return cacheContent;
}

// Initialize cache and model
let cacheContent;
let model;

// Function to get or update model
async function getModel() {
    if (!cacheContent || cacheContent.isExpired()) {
        console.log('Creating or updating cache...');
        cacheContent = await createOrUpdateCache();
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", cachedContent: cacheContent });
    }
    return model;
}

// Export the getModel function
export default getModel;

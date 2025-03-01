import model from '@/lib/gemeni';
import csvData from '@/lib/readcsv';
import { NextRequest, NextResponse } from 'next/server';
import zod from 'zod';

const gemeniCallSchema = zod.object({
    message: zod.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, success } = gemeniCallSchema.safeParse(body);

        if (!success) {
            return NextResponse.json({ msg: 'Invalid input' });
        }

        const response = await model.generateContent([
            `You are an expert in climate science, meteorology, and renewable energy. Analyze the following CSV data:

            ${csvData}

            Based on this data and the user's message: "${data.message}", provide insights, predictions, or analysis related to energy production, weather patterns, or climate trends. Focus on the relationship between weather conditions and renewable energy output if applicable.
            Your response should be informative, data-driven, and directly address the user's query. Include specific numbers and trends from the CSV data where relevant.
            Format your response as a JSON object with a single key "geminiResponse" containing your analysis as a string. For example:
            {
            "geminiResponse": "Based on the data provided, on 2025-05-01, despite 14 hours of sunlight, energy production was 0.0 kWh. This could be due to the 29% cloud cover or potential equipment issues. The temperature ranged from 13°C to 19°C, with a feels-like temperature of 14°C. These mild conditions are generally favorable for solar panel efficiency, so the lack of production is unusual and warrants investigation."
            }

            Ensure your response is well-formatted JSON that can be parsed by JavaScript's JSON.parse() function.

            dont send markdown, set the json response as plain text i can take care of the rest
            `,
        ]);
        let responseText = response.response.text();

        // Remove markdown code block if present
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            responseText = jsonMatch[1];
        }

        // Attempt to parse the JSON
        let geminiResponse;
        try {
            geminiResponse = JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return NextResponse.json({ msg: 'Error parsing response' });
        }

        return NextResponse.json(geminiResponse);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: `An error occurred`, error: (err as Error).message });
    }
}

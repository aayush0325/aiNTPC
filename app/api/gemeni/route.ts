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
            `You are a friendly AI assistant with expertise in climate science, meteorology, and renewable energy. Analyze this CSV data:
          
            ${csvData}
          
            Based on the data and the user's message: "${data.message}", provide a brief, conversational response with insights about energy production, weather patterns, or climate trends. If relevant, touch on how weather affects renewable energy output.
          
            Start with a greeting if appropriate. Keep your response concise unless the user asks for more detail. Use everyday language and explain any technical terms.
          
            Format your response as a JSON object with a "geminiResponse" key containing your analysis as a string. For example:
          
            {
              "geminiResponse": "Hi there! Looking at the data for May 1st, 2025, something interesting pops up. Despite 14 hours of sunlight, the energy production was zero. This could be due to the 29% cloud cover or maybe some technical issues. The weather was mild, with temps between 13°C and 19°C, which is usually good for solar panels. Might be worth checking if everything's working correctly!"
            }
          
            Ensure your response is valid JSON that JavaScript's JSON.parse() can handle. Don't use markdown formatting.
            `
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

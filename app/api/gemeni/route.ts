import model from '@/lib/gemeni';
import csvData from '@/lib/readcsv';
import { NextRequest, NextResponse } from 'next/server';
import zod from 'zod';

const gemeniCallSchema = zod.object({
    message: zod.string(),
    previous: zod.array(
        zod.object({
            id: zod.any(),
            text: zod.string(),
            sender: zod.string(),
            timestamp: zod.any(),
        }),
    ),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, success } = gemeniCallSchema.safeParse(body);

        if (!success) {
            return NextResponse.json({ msg: 'Invalid input' });
        }

        const response = await model.generateContent([
            `You are a friendly AI assistant with expertise in climate science, meteorology, and renewable energy. Analyze the CSV data and previous messages provided to you:
            ${data.previous.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}
            Based on the data and the user's message: "${data.message}", be friendly, don't return a response related to the data unless the message talks about it, otherwise provide a brief, conversational response with insights about energy production, weather patterns, or climate trends. If relevant, touch on how weather affects renewable energy output.
          
            Start with a greeting if appropriate. Keep your response concise unless the user asks for more detail. Use everyday language and explain any technical terms.

            Predict based on future data using your intuition and the data given to you, return a response which is relevant to the data and the user's message.
          
            Format your response as a JSON object with a "geminiResponse" key containing your analysis as a string. For example:
          
            {
              "geminiResponse": "Hello! I see you're interested in renewable energy. Did you know that solar panels generate more electricity on sunny days? 🌞"
            }
          
            Ensure your response is valid JSON that JavaScript's JSON.parse() can handle.
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

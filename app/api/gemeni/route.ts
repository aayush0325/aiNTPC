import model from '@/lib/gemeni';
import csvData from '@/lib/readcsv';

export async function GET() {
    try {
        const response = await model.generateContent([
            'take this csv and tell me what will the production be for maxtemp 45, mintemp 30',
            csvData,
        ]);
        console.log(response.response);
        return Response.json({ msg: `${response.response.text()}` });
    } catch (err) {
        console.error(err);
        return Response.json({ msg: `maa chud gayi` });
    }
}

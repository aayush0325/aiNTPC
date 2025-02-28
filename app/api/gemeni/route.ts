import model from '@/lib/gemeni';

export async function GET() {
    try {
        const response = await model.generateContent('hello gemeni');
        console.log(response.response)
        return Response.json({ msg: `${response.response.text()}` });
    } catch (err) {
        console.error(err);
        return Response.json({ msg: `maa chud gayi` });
    }
}

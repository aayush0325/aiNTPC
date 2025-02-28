import { readFile } from 'fs';

export async function GET() {
    readFile('./input.csv', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('input file imported');
    });

    return Response.json({ msg: 'server healthy' });
}

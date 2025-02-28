import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    console.log('get energy entries route hit');
    const auth = getAuth(req);
    try {
        const { userId } = auth;
        if (!userId) {
            console.log('USER WAS UNAUTHENTICATED');
            return NextResponse.json({ msg: 'unauthenticated' }, { status: 401 });
        }

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const start = Number(searchParams.get('start'));
        const end = Number(searchParams.get('end'));
        if (isNaN(start) || isNaN(end) || start > end || end - start > 30) {
            return NextResponse.json({ msg: 'invalid request' }, { status: 400 });
        }

        const response = await prisma.energyData.findMany({
            where: {
                id: {
                    gte: start,
                    lte: end,
                },
            },
        });
        if (response) {
            return NextResponse.json(
                {
                    msg: 'energy entries found',
                    response,
                },
                { status: 200 },
            );
        }

        return NextResponse.json({ msg: 'energy entries not found' }, { status: 404 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: 'An error occurred' }, { status: 500 });
    }
}

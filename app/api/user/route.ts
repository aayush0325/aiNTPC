import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import zod from 'zod';

const prisma = new PrismaClient();

const createUserRequest = zod.object({
    name: zod.string(),
    email: zod.string().email(),
});

export async function POST(req: NextRequest) {
    console.log('CREATE USER ROUTE HIT');
    const auth = getAuth(req);

    try {
        const { userId } = auth;
        if (!userId) {
            console.log('USER WAS UNAUTHENTICATED');
            return NextResponse.json({ msg: 'unauthenticated' }, { status: 401 });
        }
        const body = await req.json();
        const { success, data } = createUserRequest.safeParse(body);
        if (!success) {
            console.log('INVALID REQUEST');
            console.log(body);
            return NextResponse.json({ msg: 'invalid request' }, { status: 400 });
        }
        const user = await prisma.user.create({
            data: {
                id: userId,
                name: data.name,
                email: data.email,
            },
        });
        if (!user) {
            return NextResponse.json({ msg: 'could not create user' }, { status: 500 });
        }

        return NextResponse.json({ msg: 'user created successfully' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: 'An error occurred' }, { status: 500 });
    }
}

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import zod from 'zod';
import { config } from 'dotenv';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

const POPULATEDBSCHEMA = zod.object({
    password: zod.string(),
});

config();

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    console.log('POPULATE DATABASE ROUTE HIT');

    try {
        const body = await req.json();
        const { success, data } = POPULATEDBSCHEMA.safeParse(body);

        if (!success) {
            console.log('INVALID REQUEST');
            console.log(body);
            return NextResponse.json({ msg: 'invalid request' }, { status: 400 });
        }

        if (data.password !== process.env.POPULATE_DB_PASSWORD) {
            console.log('INVALID PASSWORD');
            return NextResponse.json({ msg: 'invalid password' }, { status: 401 });
        }

        const checkPopulated = await prisma.isPopulated.findFirst();

        if (checkPopulated?.value) {
            console.log('ATTEMPT TO OVERPOPULATE DB');
            return NextResponse.json({ msg: 'database already populated' }, { status: 400 });
        }

        const fileContent = await fs.readFile('./lib/input.csv', 'utf-8');

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
        });

        for (const record of records) {
            await prisma.energyData.create({
                data: {
                    date: new Date(record.Date),
                    production: parseFloat(record['Production (kWh)']),
                    maxtempC: parseFloat(record.maxtempC),
                    mintempC: parseFloat(record.mintempC),
                    sunHour: parseFloat(record.sunHour),
                    cloudcover: parseInt(record.cloudcover),
                    tempC: parseInt(record.tempC),
                    FeelsLikeC: parseInt(record.FeelsLikeC),
                    humidity: parseInt(record.humidity),
                    windSpeedKmph: parseInt(record.windSpeedKmph),
                    precipMM: parseFloat(record.precipMM),
                    weatherDesc: record.weatherDesc,
                },
            });
        }
        await prisma.isPopulated.create({
            data: {
                value: true,
            },
        });
        console.log('DATABASE POPULATED SUCCESSFULLY');
        return NextResponse.json({ msg: 'Database populated successfully' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: `An error occurred ${err}` }, { status: 500 });
    }
}

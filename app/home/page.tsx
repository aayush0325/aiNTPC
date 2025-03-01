'use client';

import { getCookie } from 'cookies-next';
import { useUser } from '@clerk/clerk-react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { createUser } from './createuser';
import { fetchEntries } from './fetchentries';
import { useEffect, useState } from 'react';
import ChartComponent from '@/components/plot/chart';
import { EnergyData } from '@/types/homepage/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [fullname, setFullName] = useState<string | null>('');
    const [bounds, setBounds] = useState<number[]>([1, 20]);
    const [entries, setEntries] = useState<EnergyData[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setFullName(user.fullName);
            (async () => {
                const fullName = user.fullName;
                const email = user.emailAddresses[0].emailAddress;
                const session = await getCookie('__session');
                createUser(fullName, email, session);
                fetchEntries(session, bounds[0], bounds[1], setEntries, setDates, setBounds);
            })();
        }
    }, [isLoaded, isSignedIn, user, bounds]);

    const handlePrevious = () => {
        const newBounds = [bounds[0] - 20, bounds[1] - 20];
        if (newBounds[0] >= 0 && newBounds[1] >= 0) {
            setBounds(newBounds);
        }
    };

    const handleNext = () => {
        setBounds([bounds[0] + 20, bounds[1] + 20]);
    };

    return (
        <div className="flex min-h-screen flex-col min-w-full gap-8 p-4">
            <div className="flex justify-start mx-4 md:mx-12">
                <SparklesText text={`Welcome ${fullname}`} className="text-2xl md:text-4xl" />
            </div>
            <div className="flex pl-4 md:pl-20 justify-between">
                <h1 className="text-xl md:text-2xl font-bold">Know your renewable energy</h1>
                <div className="mr-12 flex gap-4">
                    <Button onClick={handlePrevious}>previous</Button>
                    <Button onClick={handleNext}>next</Button>
                </div>
            </div>
            <div className="flex justify-center items-center flex-col gap-12">
                <div>
                    <h1 className="font-bold">
                        {dates[0] && dates[1] && `Data from ${dates[0]} to ${dates[1]}`}
                    </h1>
                </div>
                <div className="flex flex-wrap justify-center w-full gap-4 md:gap-12">
                    {entries ? (
                        <>
                            <ChartComponent
                                x={entries.map(entry => new Date(entry.date).getTime())}
                                y={entries.map(entry => entry.tempC)}
                                xlabel="Time"
                                ylabel="Temperature"
                                ymin={Math.min(...entries.map(entry => entry.tempC)) - 10}
                            />
                            <ChartComponent
                                x={entries.map(entry => new Date(entry.date).getTime())}
                                y={entries.map(entry => entry.production)}
                                xlabel="Time"
                                ylabel="Production (kWh)"
                                ymin={Math.min(...entries.map(entry => entry.production)) - 10}
                            />
                            <ChartComponent
                                x={entries.map(entry => new Date(entry.date).getTime())}
                                y={entries.map(entry => entry.sunHour)}
                                xlabel="Time"
                                ylabel="Sun Hours"
                                ymin={Math.min(...entries.map(entry => entry.sunHour)) - 10}
                            />
                            <ChartComponent
                                x={entries.map(entry => new Date(entry.date).getTime())}
                                y={entries.map(entry => entry.windSpeedKmph)}
                                xlabel="Time"
                                ylabel="Wind Speed (kmph)"
                                ymin={Math.min(...entries.map(entry => entry.windSpeedKmph)) - 10}
                            />
                        </>
                    ) : (
                        <div className="text-2xl font-bold">No data available</div>
                    )}
                </div>
                <div className="mb-20">
                    <Button onClick={() => router.push('/prediction')}>View predictions</Button>
                </div>
            </div>
        </div>
    );
}

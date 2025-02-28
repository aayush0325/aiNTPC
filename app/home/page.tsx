'use client';

import { getCookie } from 'cookies-next';
import { useUser } from '@clerk/clerk-react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { createUser } from './createuser';
import { fetchEntries } from './fetchentries';
import { useEffect, useState } from 'react';
import ChartComponent from '@/components/plot/chart';
import { EnergyData } from '@/types/homepage/types';

export default function Home() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [fullname, setFullName] = useState<string | null>('');
    const [bounds, setBounds] = useState<number[]>([1, 20]);
    const [entries, setEntries] = useState<EnergyData[]>([]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setFullName(user.fullName);
            (async () => {
                const fullName = user.fullName;
                const email = user.emailAddresses[0].emailAddress;
                const session = await getCookie('__session');
                createUser(fullName, email, session);
                fetchEntries(session, bounds[0], bounds[1], setEntries);
            })();
        }
    }, [isLoaded, isSignedIn, user]);

    return (
        <div className="flex min-h-screen flex-col min-w-full gap-8 p-4">
            <div className="flex justify-start mx-4 md:mx-12">
                <SparklesText text={`Welcome ${fullname}`} className="text-2xl md:text-4xl" />
            </div>
            <div className="flex justify-start pl-4 md:pl-20">
                <h1 className="font-bold text-xl md:text-2xl">Know your renewable energy</h1>
            </div>
            <div className="flex flex-wrap justify-center w-full gap-4 md:gap-12">
                <ChartComponent />
                <ChartComponent />
                <ChartComponent />
                <ChartComponent />
            </div>
        </div>
    );
}

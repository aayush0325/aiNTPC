'use client';
import { getCookie } from 'cookies-next';

import { useUser } from '@clerk/clerk-react';
import { SparklesText } from '@/components/magicui/sparkles-text';

import { createUser } from './createuser';
import { useEffect, useState } from 'react';

export default function Home() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [fullname, setFullName] = useState<string | null>('');

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setFullName(user.fullName);
            (async () => {
                const fullName = user.fullName;
                const email = user.emailAddresses[0].emailAddress;
                const session = await getCookie('__session');
                createUser(fullName, email, session);
            })();
        }
    }, [isLoaded, isSignedIn, user]);

    return (
        <div className="flex min-h-screen  ">
            <div className="flex justify-start mx-12 my-6 ">
                {' '}
                <SparklesText text={`Welcome ${fullname}`} className="text-xl" />
            </div>
        </div>
    );
}

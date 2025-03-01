export async function fetchEntries(
    cookie: string | undefined,
    start: number,
    end: number,
    setEntries: any,
    setDates: any,
    setBounds: any,
) {
    try {
        const response = await fetch(
            encodeURI(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/energy/get?start=${start}&end=${end}`,
            ),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookie}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        console.log('response:', res.response);
        setEntries(res.response);
        setDates([
            new Date(res.firstEntryDate).toLocaleString(),
            new Date(res.lastEntryDate).toLocaleString(),
        ]);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

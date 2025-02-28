export async function fetchEntries(
    cookie: string | undefined,
    start: number,
    end: number,
    setEntries: any,
) {
    try {
        const response = await fetch(
            encodeURI(`http://localhost:3000/api/energy/get?start=${start}&end=${end}`),
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
        const res = (await response.json()).response;
        console.log('response:', res);
        setEntries(res);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

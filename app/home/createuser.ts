export const createUser = async (
    fullName: string | null | undefined,
    email: string | null | undefined,
    cookie: string | undefined,
) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookie}`,
            },
            body: JSON.stringify({
                name: fullName,
                email: email,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

import { Message } from './page';

export const sendMessage = async (
    input: string,
    setMessages: any,
    setInput: any,
    sessionCookie: string | undefined,
    messages: Message[],
) => {
    if (input.trim()) {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev: Message[]) => [...prev, userMessage]);
        setInput('');

        // Add loading message
        const loadingMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Loading...',
            sender: 'system',
            timestamp: new Date(),
        };

        setMessages((prev: Message[]) => [...prev, loadingMessage]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gemeni`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionCookie}`,
                },
                body: JSON.stringify({ message: input, previous: messages }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.geminiResponse) {
                const systemMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    text: data.geminiResponse,
                    sender: 'system',
                    timestamp: new Date(),
                };

                setMessages((prev: Message[]) =>
                    prev.map(msg => (msg.id === loadingMessage.id ? systemMessage : msg)),
                );
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 2).toString(),
                text: 'An error occurred while processing your request.',
                sender: 'system',
                timestamp: new Date(),
            };

            setMessages((prev: Message[]) =>
                prev.map(msg => (msg.id === loadingMessage.id ? errorMessage : msg)),
            );
        }
    }
};

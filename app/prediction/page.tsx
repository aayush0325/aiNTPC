'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Delete } from 'lucide-react';
import { getCookie } from 'cookies-next';

export type Message = {
    id: string;
    text: string;
    sender: 'user' | 'system';
    timestamp: Date;
};

import { sendMessage } from './callgemeni';

export default function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sessionCookie, setSessionCookie] = useState<string | undefined>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            const session = await getCookie('__session');
            setSessionCookie(session);
        })();
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage(input, setMessages, setInput, sessionCookie, messages);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessageText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: 'Welcome to aiNTPC. How can I help you today?',
                sender: 'system',
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-20 px-32">
                {messages.map(message => (
                    <div key={message.id} className={'py-4'}>
                        <div className="px-4">
                            {message.sender === 'user' ? (
                                <div className="flex justify-end">
                                    <div className="max-w-md bg-blue-500 text-white rounded-lg py-2 px-4">
                                        <div>{formatMessageText(message.text)}</div>
                                        <div className="text-xs text-blue-100 text-right mt-1">
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-start">
                                    <div className="max-w-md border border-gray-200 rounded-lg py-2 px-4 bg-white">
                                        <div>{formatMessageText(message.text)}</div>
                                        <div className="text-xs text-gray-400 text-right mt-1">
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 p-6 bg-white">
                <div className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={() =>
                            sendMessage(input, setMessages, setInput, sessionCookie, messages)
                        }
                        disabled={!input.trim()}
                        className={`p-2 rounded-r flex items-center justify-center ${
                            input.trim()
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                        <Send size={20} />
                    </button>
                    <button
                        onClick={() =>
                            setMessages([
                                {
                                    id: Date.now().toString(),
                                    text: 'Welcome to aiNTPC. How can I help you today?',
                                    sender: 'system',
                                    timestamp: new Date(),
                                },
                            ])
                        }
                        className={`p-2 rounded-r flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white`}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                        <Delete size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

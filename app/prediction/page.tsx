'use client'

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'system';
    timestamp: Date;
};

export default function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            // Add user message
            const userMessage: Message = {
                id: Date.now().toString(),
                text: input,
                sender: 'user',
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            
            // Simulate a response
            setTimeout(() => {
                const systemMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `You said: "${input}"`,
                    sender: 'system',
                    timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, systemMessage]);
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // For testing - you can remove this in production
    useEffect(() => {
        // Add a welcome message if there are no messages
        if (messages.length === 0) {
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: "Welcome to aiNTPC. How can I help you today?",
                sender: 'system',
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto pb-4">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`py-4 ${message.sender === 'user' ? 'bg-blue-50' : ''}`}
                    >
                        <div className="px-4">
                            {message.sender === 'user' ? (
                                <div className="flex justify-end">
                                    <div className="max-w-md bg-blue-500 text-white rounded-lg py-2 px-4">
                                        <div>{message.text}</div>
                                        <div className="text-xs text-blue-100 text-right mt-1">
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-start">
                                    <div className="max-w-md border border-gray-200 rounded-lg py-2 px-4 bg-white">
                                        <div>{message.text}</div>
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
            
            {/* Input area */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 p-6 bg-white">
                <div className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={sendMessage}
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
                </div>
            </div>
        </div>
    );
}
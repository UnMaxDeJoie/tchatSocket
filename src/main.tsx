import React, { useEffect, useState } from 'react';

interface Message {
    username: string;
    text: string;
}

const WebSocketComponent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState('');
    const [messageText, setMessageText] = useState('');

    const ws = new WebSocket('ws://localhost:5173');

    useEffect(() => {
        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleSend = () => {
        if (messageText && username) {
            const message = {
                text: messageText,
                username: username,
            };
            ws.send(JSON.stringify(message));
            setMessageText('');
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                <button onClick={handleSend}>Send</button>
            </div>
            <div>
                <h2>Messages:</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>{message.username}:</strong> {message.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketComponent;

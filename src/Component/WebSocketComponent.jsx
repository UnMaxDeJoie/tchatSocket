import React, { Component } from 'react';
import WebSocketClient from 'websocket';

class WebSocketComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: '',
        };
        this.socket = new WebSocketClient('ws://localhost:5173/');
    }

    componentDidMount() {
        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            this.setState((prevState) => ({
                messages: [...prevState.messages, newMessage],
            }));
        };

        this.socket.onclose = () => {
            console.log('WebSocket closed');
        };
    }

    sendMessage = () => {
        const { message } = this.state;
        const newMessage = {
            text: message,
            // Vous pouvez également inclure d'autres informations comme l'expéditeur, la date, etc.
        };
        this.socket.send(JSON.stringify(newMessage));
        this.setState({ message: '' });
    };

    handleChange = (e) => {
        this.setState({ message: e.target.value });
    };

    render() {
        const { messages, message } = this.state;

        return (
            <div>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>{msg.text}</div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={this.handleChange}
                    placeholder="Entrez votre message..."
                />
                <button onClick={this.sendMessage}>Envoyer</button>
            </div>
        );
    }
}

export default WebSocketComponent;

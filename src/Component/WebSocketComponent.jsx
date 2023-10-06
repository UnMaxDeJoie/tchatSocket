import React, { Component } from 'react';

class WebSocketComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: '',
            username: '',
        };
        this.socket = new WebSocket('ws://localhost:5173');
    }

    componentDidMount() {
        this.socket.onopen = () => {
            console.log('Connexion WebSocket établie.');
        };

        this.socket.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            this.setState((prevState) => ({
                messages: [...prevState.messages, receivedMessage],
            }));
        };

        this.socket.onerror = (error) => {
            console.error('Une erreur WebSocket s\'est produite :', error);
        };

        this.socket.onclose = () => {
            console.log('Connexion WebSocket fermée.');
        };
    }

    componentWillUnmount() {
        this.socket.close();
    }

    sendMessage = () => {
        const { message, username } = this.state;
        if (message.trim() !== '' && username.trim() !== '') {
            this.socket.send(JSON.stringify({ text: message, username }));
            this.setState({ message: '' });
        }
    };

    handleChange = (e) => {
        this.setState({ message: e.target.value });
    };

    handleUsernameChange = (e) => {
        this.setState({ username: e.target.value });
    };

    render() {
        const { messages, message, username } = this.state;

        return (
            <div>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.username}: </strong>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={this.handleUsernameChange}
                        placeholder="Entrez votre nom d'utilisateur..."
                    />
                    <input
                        type="text"
                        value={message}
                        onChange={this.handleChange}
                        placeholder="Entrez votre message..."
                    />
                    <button onClick={this.sendMessage}>Envoyer</button>
                </div>
            </div>
        );
    }
}

export default WebSocketComponent;

import React, { useState } from 'react';
import {  Form, Input } from 'reactstrap';
import socketIOClient from "socket.io-client";
import Picker from "emoji-picker-react";

import './ChatBtn.css';

function ChatBtn() {
    const [messageInput, setMessageInput] = useState('');
    const socket = socketIOClient('http://localhost:5000/');
    const channelId = localStorage.getItem('channelId');
    const user = localStorage.getItem('user');
    const [emojiVisible, setEmojiVisible] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        setMessageInput((messageInput) => messageInput + emojiObject.emoji);
    };

    function onClickPostMessages() {
        const today = new Date();
        const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const [month, date, year] = today.toLocaleDateString().split("/");
        const present = `${time}, ${date}-${month}-${year}`;

        socket.emit("send-message", {
            mess: messageInput,
            time: present,
            channelId,
            user
        });

        setMessageInput(() => '');
    }

    return (
        <div className="message-input d-flex">
            <Form className="w-100 position-relative">
                <Input id="input"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    type="text" 
                    placeholder="Enter Message..." 
                />
                <div className="emoij-btn">
                    <span onClick={() => setEmojiVisible(() => !emojiVisible)}>&#128512;</span>
                    { emojiVisible && 
                        <Picker onEmojiClick={onEmojiClick} />
                    }
                </div>
            </Form>
            <div className="col-auto col align-self-center pr-0">
                <button 
                    onClick={onClickPostMessages}
                    type="button" 
                    className="btn-rounded chat-send btn btn-primary"
                >
                    <span className="mr-2">Send</span> 
                    <img 
                        src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Ficons8-email-send-16.png?v=1596705546300" 
                        alt="" 
                    />
                </button>
            </div>
        </div>
    );
}

export default ChatBtn;

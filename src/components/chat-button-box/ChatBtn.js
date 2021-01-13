import React, { useState } from 'react';
import {  Form, Input } from 'reactstrap';
import socketIOClient from "socket.io-client";
import Picker from "emoji-picker-react";
import classNames from 'classnames';
import axios from 'axios';

import paperclip from '../../images/paperclip.svg';

import './ChatBtn.css';
import Label from 'reactstrap/lib/Label';

function ChatBtn(props) {
    const { setMessages, messages } = props;

    const [messageInput, setMessageInput] = useState('');
    const socket = socketIOClient('http://localhost:5000/');
    const channelId = localStorage.getItem('channelId');
    const user = localStorage.getItem('user');
    const [emojiVisible, setEmojiVisible] = useState(false);
    const [upload, setUpload] = useState('');

    const onEmojiClick = (event, emojiObject) => {
        setMessageInput((messageInput) => messageInput + emojiObject.emoji);
    };

    function onKeyUp(e) {
        if (e.charCode === 13) 
            onClickPostMessages();
    }

    function onClickPostMessages(e) {
        let formData = new FormData();

        formData.append("file", upload);
        formData.append("upload_preset", "Tiko-chat-app");
        formData.append("cloud_name", "coders.tokyo");

        const today = new Date();
        const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const [month, date, year] = today.toLocaleDateString().split("/");
        const present = `${time}, ${date}-${month}-${year}`;

        if (upload)
            return axios.post('https://api.cloudinary.com/v1_1/coders-tokyo/upload', formData)
                    .then(res => {
                        const newMessage = {
                            content: messageInput,
                            upload: res.data.url,
                            time: present,
                            channelId,
                            user: JSON.parse(user) 
                        };   
                        
                        setMessages(() => [...messages, newMessage]);
                        socket.emit("send-message", newMessage);
                
                        setMessageInput(() => '');
                        setUpload(() => '');
                    })
                    .catch(err => console.log(err));
        
        const newMessage = {
            content: messageInput,
            upload,
            time: present,
            channelId,
            user: JSON.parse(user) 
        };   
        
        setMessages(() => [...messages, newMessage]);
        socket.emit("send-message", newMessage);

        setMessageInput(() => '');
    }

    return (
        <div className="message-input d-flex">
            <Form 
                className="w-100 position-relative"
                onKeyPress={onKeyUp}
                className="d-flex justify-content-between  align-items-center"
            >
                <div className="chat-box">
                    <div>
                        <Input id="input"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            type="text" 
                            placeholder="Enter Message..." 
                        />
                        <div className="icon-right d-flex">
                            <div className="emoij-btn mr-1">
                                <span onClick={() => setEmojiVisible(() => !emojiVisible)}>&#128512;</span>
                                { emojiVisible && 
                                    <Picker onEmojiClick={onEmojiClick} />
                                }
                            </div>
                            <div className="upload mr-1">
                                <Label for="upload-img">
                                    <img src={paperclip} alt="" />
                                </Label>
                            </div>
                        </div>
                    </div>
                    <div className={classNames(
                        "upload-content",
                        {"displayNone": upload === ''}
                    )}>
                        <Input 
                           type="file" 
                           name="file"
                           id="upload-img"
                           onChange={(e) => setUpload(e.target.files[0])}
                        />
                    </div>
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

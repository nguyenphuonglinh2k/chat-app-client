import React, { useState, useEffect } from 'react';
import classNames from "classnames";
import axios from 'axios';
import socketIOClient from "socket.io-client";

import { useHistory } from "react-router-dom";

import MessageCard from '../message-card/MessageCard';
import Sidebar from '../sidebar/Sidebar';
import ChatBtn from '../chat-button-box/ChatBtn';
import Profile from '../profile/Profile';
import NavbarHeader from '../Navbar-header';
import Toast from '../Toast';

import './Chat.css';

function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [channelIdCurrent, setChannelIdCurrent] = useState(
        localStorage.getItem('channelId') ?
        localStorage.getItem('channelId') :
        '5f325c4598326349ea89ef84'
    );

    const socket = socketIOClient('http://localhost:5000');

    // let channelIdCurrent = localStorage.getItem('channelId') || '5f325c4598326349ea89ef84';
    let history = useHistory();

    socket.on("message-res", function(data) {
        setMessages(() => data);    
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/chat/channel/${channelIdCurrent}`, {
            headers: {
                authorization: localStorage.getItem('jwt')
            }
        })
            .then((res) => {
                if (res.data.errorLogin) {
                    localStorage.clear();
                    Toast.fire({
                        icon: 'error',
                        title: res.data.errorLogin
                    });
                    return history.push('/signin');
                }

                setMessages(() => res.data.messages);
                localStorage.setItem('channelId', res.data.channelId);
            })
            .catch((err) => console.log(err));
        
    }, [])

    return (
        <div className="Chat">
            <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                setMessages={setMessages}
                channelIdCurrent={channelIdCurrent}
                setChannelIdCurrent={setChannelIdCurrent}
            />

            <div className={classNames('main-content', 'w-100', 'h-100', {'padding-none': !sidebarOpen})}>
                <NavbarHeader 
                    setSidebarOpen={setSidebarOpen} 
                    sidebarOpen={sidebarOpen} 
                    setIsProfileOpen={setIsProfileOpen} 
                />

                <div className={classNames('page-content', {'margin-right': isProfileOpen})}>
                    <div className="chat-content h-100">
                        <div className="page-title-box">
                            <h4>CHAT</h4>
                        </div>
                        <div className="col-12 col h-100 d-flex flex-column justify-content-space">
                            <div className="w-100 messages-box mb-4">
                                <MessageCard messages={messages} />
                            </div>
                            <div className="w-100">
                                <ChatBtn setMessages={setMessages} messages={messages}/>
                            </div>
                        </div>
                    </div>
                    <Profile isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} />
                </div>
            </div>
        </div>
    );
}

export default Chat;

import React, { useState, useEffect } from 'react';
import classNames from "classnames";
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import MessageCard from '../message-card/MessageCard';
import Sidebar from '../sidebar/Sidebar';
import ChatBtn from '../chat-button-box/ChatBtn';
import Toast from '../Toast';

import './Chat.css';

function Chat() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const socket = socketIOClient('http://localhost:5000');

    let channelIdCurrent = localStorage.getItem('channelId') || '5f325c4598326349ea89ef84';
    let history = useHistory();

    socket.on("message-res", function(data) {
        setMessages(() => data);    
    });

    function onClickLogOut() {
        localStorage.clear();
        history.push('/signin');
    }

    useEffect(() => {
        axios.get(`http://localhost:5000/chat/channel/${channelIdCurrent}`, {
            headers: {
                authorization: localStorage.getItem('jwt')
            }
        })
            .then((res) => {
                if (res.data.error) {
                    localStorage.clear();
                    Toast.fire({
                        icon: 'error',
                        title: res.data.error
                    });
                    return history.push('/signin');
                }

                setMessages(() => res.data.messages);
                localStorage.setItem('channelId', res.data.channelId);
            })
            .catch((err) => console.log(err));
        
    }, [channelIdCurrent, history])

    return (
        <div className="Chat">
            <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                setMessages={setMessages}
            />

            <div className={classNames('main-content', 'w-100', 'h-100', {'padding-none': !sidebarOpen})}>
                <div className="page-topbar d-flex justify-content-between align-items-center">
                    <div onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn">
                        <img src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Flist.svg?v=1596545874905" alt="" />
                    </div>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle>
                            <div className="header-profile">
                                <img 
                                    className="rounded-circle header-profile-user pr-2" 
                                    src="http://skote-v-light.react.themesbrand.com/static/media/avatar-1.67e2b9d7.jpg" 
                                    alt="Header Avatar" 
                                />
                            </div>
                        </DropdownToggle>
                        <DropdownMenu right className="mt-2">
                            <DropdownItem>Profile</DropdownItem>
                            <DropdownItem onClick={onClickLogOut}>Log out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <div className='page-content'>
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
            </div>
        </div>
    );
}

export default Chat;

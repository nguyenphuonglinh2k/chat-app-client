import React, {useState, useEffect} from 'react';
import classNames from "classnames";
import axios from 'axios';
import { useHistory } from "react-router-dom";

import AddChannelBtn from '../AddChannelBtn';
import Toast from '../Toast';

import 'antd/dist/antd.css';
import './Sidebar.css';

function Sidebar(props) {
    const { sidebarOpen, setSidebarOpen, setMessages } = props;
    const [channels, setChannels] = useState([]);

    let currentChannelId = localStorage.getItem('channelId') || "5f325c4598326349ea89ef84";
    let history = useHistory();
    
    useEffect(() => {
        axios.get('http://localhost:5000/chat/channels')
            .then((res) => {
                setChannels(() => res.data);
            })
            .catch((err) => console.log(err));

    }, [])

    function onClickGetMessage(e) {
        const channelId = e.target.dataset.id;

        axios.get(`http://localhost:5000/chat/channel/${channelId}`, {
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

                localStorage.setItem('channelId', res.data.channelId);
                setMessages(() => res.data.messages);
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={ classNames('sidebar', {"nonVisible": !sidebarOpen}) }>
            <div className="logo d-flex justify-content-between">
                <div className="logo-name">
                    <img  src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Flogo.4dbbacd2.svg?v=1597420315594" alt="" />
                    TIKO
                </div>
                <img 
                    onClick={() => setSidebarOpen(false)}
                    src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fcross.svg?v=1596721763254" 
                    alt="" 
                />
            </div>
            <div className="vertical-menu pt-2">
                <ul>
                    <li>
                        <img src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Ficons8-menu-rounded-50.png?v=1596541736150" alt="" />
                        <span>All unreads</span>
                    </li>
                    <li>
                        <img src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fconversation.svg?v=1596542126344" alt="" />
                        <span>Threads</span>
                    </li>
                    <li>
                        <img src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fcopy.svg?v=1596543073128" alt="" />
                        <span>Drafts</span>
                    </li>
                    <li>
                        <img src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fbookmark.svg?v=1596542475338" alt="" />
                        <span>Saved items</span>
                    </li>
                </ul>
                <ul className="channels">
                    <li className="d-flex justify-content-between">
                        <span className="menu-title">CHANNELS</span> 
                        <AddChannelBtn channels={channels} setChannels={setChannels} />
                    </li>
                    { channels.length &&                
                        channels.map((channel, index) => 
                            <li 
                                className={classNames('channel-item', { 'color-focus':  (currentChannelId === channel._id) })}
                                key={index} 
                                onClick={(e) => onClickGetMessage(e)} 
                            >
                                <span data-id={channel._id}># {channel.channelName}</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;

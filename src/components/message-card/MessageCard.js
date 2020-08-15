import React, {useEffect} from 'react';

import './MessageCard.css';

function MessageCard(props) {
    const {messages} = props;

    useEffect(() => {
        if (!messages.length) {
            let del = document.getElementById('none-text');
            del.textContent = '';
        }
    });

    return (
        <div>
            { !messages.length && 
                <div className="d-flex justify-content-center non-message" >
                    <img 
                        src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fundraw_Group_chat_unwm.svg?v=1596550620025" 
                        alt="" 
                    />
                </div>
            }

            <div id="none-text">
                { messages.length && 
                    messages.map((message, index) => 
                        <div key={index} className="card-body w-100 bg-white mb-2">
                            <div className="message-card d-flex" key={index}>
                                <div className="header-profile">
                                    <img 
                                        className="rounded-circle header-profile-user" 
                                        src={message.user.userImageUrl}
                                        alt="Header Avatar" 
                                    />
                                </div>
                                <div className="message-content w-100">
                                    <div className="text-top d-flex">
                                        <span>{ message.user.username }</span>
                                        <span>{ message.time }</span>
                                    </div>
                                    <div className="text-bottom">
                                        { message.content }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default MessageCard;

import React, { useState} from 'react';

import { Modal, Button, Input, Radio } from 'antd';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import Toast from './Toast';

function AddChannelBtn(props) {
    const user = JSON.parse(localStorage.getItem('user'));

    const { setChannels, channels } = props;
    const [channelName, setChannelName] = useState('');
    const [visible, setVisible] = useState(false);
    const [channelType, setChannelType] = useState("public");

    let history = useHistory();

    const onChangeChannelType = e => {
        setChannelType(e.target.value);
    };

    function handleOk() {
        axios.post(`http://localhost:5000/chat/create-channel`, {
            channelName,
            channelType,
            adminId: user._id
        }, {
            headers: {
                authorization: localStorage.getItem('jwt')
            }
        }).then((res) => {
            setVisible(() => false);

            if (res.data.errorLogin) {
                localStorage.clear();
                Toast.fire({
                    icon: 'error',
                    title: res.data.errorLogin
                });
                return history.push('/signin');
            }

            if (res.data.error)
                return Toast.fire({
                    icon: "error",
                    title: res.data.error,
                });

            setChannels(() => [...channels, res.data.newChannel]);
            setChannelName(() => '');
            
            return Toast.fire({
                icon: 'success',
                title: res.data.message
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <span>
            <img
                onClick={() => setVisible(true)}
                className="add-channel-btn"
                src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fadd.svg?v=1597129203908"
                alt=""
            />
            <Modal
                visible={visible}
                title="Channel Name"
                onOk={handleOk}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Submit
                    </Button>,
                ]}
            >
                <Input 
                    className="mb-3"
                    value={channelName} 
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Enter channel name" 
                />
                <Radio.Group 
                    onChange={onChangeChannelType} 
                    value={channelType}
                >
                    <Radio defaultChecked="true" value="public">Public</Radio>
                    <Radio value="private">Private</Radio>
                </Radio.Group>
            </Modal>
        </span>
    );
}

export default AddChannelBtn;

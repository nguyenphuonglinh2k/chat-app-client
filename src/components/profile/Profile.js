import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import axios from 'axios';
import classNames from 'classnames';

import Toast from '../Toast';

import './Profile.css';

export default function Profile(props) {
    const {isProfileOpen, setIsProfileOpen} = props;
    let {username, email, userImageUrl, _id } = JSON.parse(localStorage.getItem('user')) || {};

    const [newUsername, setNewUsername] = useState(username);
    const [newAvatar, setNewAvatar] = useState(userImageUrl);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
      };
    
    const handleOkOfEditProfile = () => {
        let formData = new FormData();

        formData.append("file", newAvatar);
        formData.append("upload_preset", "Tiko-chat-app");
        formData.append("cloud_name", "coders.tokyo");

        axios.post('https://api.cloudinary.com/v1_1/coders-tokyo/upload', formData)
            .then(res => {
                let newInfo = {
                    _id,
                    username: newUsername,
                    email,
                    userImageUrl: res.data.url
                };
        
                localStorage.setItem('user', JSON.stringify(newInfo));

                window.location.reload();

                axios.post(`http://localhost:5000/account/edit-profile/${_id}`, {
                    userImageUrl: res.data.url,
                    username: newUsername
                },  {
                    headers: {
                        authorization: localStorage.getItem('jwt')
                    }
                })
                .then(function (response) {
                    if (response.data.errorLogin)
                        return  Toast.fire({
                            icon: 'error',
                            title: response.data.errorLogin
                        });

                    if (response.data.error)
                        return Toast.fire({
                            icon: 'error',
                            title: response.data.error
                        });
                        
                    Toast.fire({
                        icon: 'success',
                        title: response.data.message
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
            })
            .catch(err => console.log(err));

        setIsModalVisible(false);
    };

    function onClickCloseProfile() {
        setIsProfileOpen(() => false);
    }

    return (
        <div className={ classNames('Profile', {"nonVisible": !isProfileOpen}) }>
            <div className="profile-header profile-pad d-flex justify-content-between">
                <div>Profile</div>
                <div onClick={onClickCloseProfile}>
                    <img 
                        className="close-btn" 
                        src="https://cdn.glitch.com/f1d3abdb-f37a-45be-95de-3c9f3be7e937%2Fmultiply-mathematical-sign.png?v=1608106060594" 
                        alt=""
                    />
                </div>
            </div>
            <div className="profile-content">
                <div className="avatarURL profile-pad d-flex justify-content-center">
                    <img src={userImageUrl} alt="avatar" />
                </div>
                <div className="username"><span>Name:</span> { username }</div>
                <div className="email"><span>Email:</span> { email }</div>
            </div>
            <div className="edit-btn">
                <button type="button" onClick={showModal}>Edit profile</button>
            </div>
            <div className="Modal-edit-btn">
                <Modal
                    visible={isModalVisible}
                    title="Edit Profile"
                    onOk={handleOkOfEditProfile}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setIsModalVisible(false)}>
                            Close
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOkOfEditProfile}>
                            Ok
                        </Button>,
                    ]}
                >   
                    
                    <div className="avatarURL flex-column align-items-center profile-pad d-flex justify-content-center">
                        <label for="upload-avt"><img src={userImageUrl} alt="avatar" /></label>
                        <Input 
                            type="file" 
                            name="file"
                            id="upload-avt"
                            onChange={(e) => setNewAvatar(e.target.files[0])}
                        />
                    </div>
                    <label for="inputName">New Username</label>
                    <Input 
                        type="text" 
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        id="inputName" 
                        placeholder="Enter new name" 
                        required
                    />
                </Modal>
            </div>
        </div>
    );
}
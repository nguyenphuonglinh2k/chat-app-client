import React, { useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import { Modal, Button, Input } from 'antd';

import AddChannelBtn from "../AddChannelBtn";
import Toast from "../Toast";
import lock from '../../images/lock.svg';

import "antd/dist/antd.css";
import "./Sidebar.css";

function Sidebar(props) {
  const { sidebarOpen, setSidebarOpen, setMessages, channelIdCurrent, setChannelIdCurrent } = props;
  const [channels, setChannels] = useState([]);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleDel, setVisibleDel] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  // let channelIdCurrent =
  //   localStorage.getItem("channelId") || "5f325c4598326349ea89ef84";
  let history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:5000/chat/channels")
      .then((res) => {
        setChannels(() => res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function getMessagesInGeneralChannel() {
    
  }

  function onClickAddUser(channelId) {
    setVisibleAdd(() => false);
    axios
      .post(`http://localhost:5000/chat/add-user/${channelId}`, {
        email: inputValue
      }, {
        headers: {
          authorization: localStorage.getItem("jwt"),
        },
      })
      .then(res => {
        setInputValue('');
        if (res.data.errorLogin) {
          localStorage.clear();

          Toast.fire({
            icon: "error",
            title: res.data.errorLogin,
          });
          return history.push("/signin");
        }

        if (res.data.error)
          return Toast.fire({
            icon: "error",
            title: res.data.error,
          });
        
        Toast.fire({
          icon: "success",
          title: res.data.message,
        });
      })
      .catch(err => console.log(err));
  }

  function onClickDeleteUser(channelId) {
    setVisibleDel(() => false);
    axios
      .post(`http://localhost:5000/chat/delete-user/${channelId}`, {
        email: inputValue
      }, {
        headers: {
          authorization: localStorage.getItem("jwt"),
        },
      })
      .then(res => {
        setInputValue('');
        if (res.data.errorLogin) {
          localStorage.clear();

          Toast.fire({
            icon: "error",
            title: res.data.errorLogin,
          });
          return history.push("/signin");
        }

        if (res.data.error)
          return Toast.fire({
            icon: "error",
            title: res.data.error,
          });
        
        Toast.fire({
          icon: "success",
          title: res.data.message,
        });
      })
      .catch(err => console.log(err));
  }

  function onClickDeleteChannel(channelId) {
    axios
      .post(`http://localhost:5000/chat/delete-channel/${channelId}`, {}, {
        headers: {
          authorization: localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        if (res.data.errorLogin) {
          localStorage.clear();

          Toast.fire({
            icon: "error",
            title: res.data.errorLogin,
          });
          return history.push("/signin");
        }

        localStorage.setItem("channelId", "5f325c4598326349ea89ef84");
        setChannelIdCurrent(() => "5f325c4598326349ea89ef84");

        let e = {target: {dataset: {id: "5f325c4598326349ea89ef84", type: "public"}}};
        onClickGetMessage(e);

        Toast.fire({
          icon: "success",
          title: res.data.message,
        });

        const element = channels.find(channel => channel._id === channelId);
        if (typeof element === 'object') {
          const index = channels.indexOf(element);
          setChannels(() => [
            ...channels.slice(0, index),
            ...channels.slice(index + 1)
          ]);
        }
      })
      .catch((err) => console.log(err));
  }

  function onClickGetMessage(e) {
    const channelId = e.target.dataset.id;
    const channelType = e.target.dataset.type;

    if (channelType === "public") 
      axios
        .get(`http://localhost:5000/chat/channel/${channelId}`, {
          headers: {
            authorization: localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          if (res.data.errorLogin) {
            localStorage.clear();

            Toast.fire({
              icon: "error",
              title: res.data.errorLogin,
            });
            return history.push("/signin");
          }

          if (res.data.error)
            return Toast.fire({
              icon: "error",
              title: res.data.error,
            });

          setChannelIdCurrent(() => res.data.channelId);
          localStorage.setItem("channelId", res.data.channelId);
          setMessages(() => res.data.messages);
        })
        .catch((err) => console.log(err));
  }

  return (
    <div className={classNames("sidebar", { nonVisible: !sidebarOpen })}>
      <div className="logo d-flex justify-content-between">
        <div className="logo-name">
          <img
            src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Flogo.4dbbacd2.svg?v=1597420315594"
            alt=""
          />
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
            <img
              src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Ficons8-menu-rounded-50.png?v=1596541736150"
              alt=""
            />
            <span>All unreads</span>
          </li>
          <li>
            <img
              src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fconversation.svg?v=1596542126344"
              alt=""
            />
            <span>Threads</span>
          </li>
          <li>
            <img
              src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fcopy.svg?v=1596543073128"
              alt=""
            />
            <span>Drafts</span>
          </li>
          <li>
            <img
              src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Fbookmark.svg?v=1596542475338"
              alt=""
            />
            <span>Saved items</span>
          </li>
        </ul>
        <ul className="channels">
          <li className="d-flex justify-content-between">
            <span className="menu-title">CHANNELS</span>
            <AddChannelBtn 
              channels={channels} 
              setChannels={setChannels} 
              setChannelIdCurrent={setChannelIdCurrent}
            />
          </li>
          {channels.length &&
            channels.map((channel, index) => (
              <li
                className={classNames("channel-item", {
                  "color-focus": channelIdCurrent === channel._id,
                })}
                key={index}
                onClick={(e) => onClickGetMessage(e)}
              >
                <span 
                  className="d-flex justify-content-between align-items-center" 
                  data-id={channel._id}
                  data-type="public"
                >
                  {channel.userList.find(userId => userId === user._id) ?
                    `# ${channel.channelName}` :
                    <span className="channel-ban">
                      <img src={lock} alt="" /> 
                      {channel.channelName} 
                    </span>
                  }
                  
                  { (user._id === channel.adminId) ? 
                    <span className="openChipImg">
                      <img 
                        src="https://cdn.glitch.com/f1d3abdb-f37a-45be-95de-3c9f3be7e937%2Fplay-button-arrowhead.png?v=1608885711370" 
                        alt="" 
                      />
                      <span className="chipList">
                        <Chip 
                          onClick={() => setVisibleAdd(true)}
                          label="Add user" 
                          color="primary" 
                          clickable 
                        />
                        <Chip 
                          onClick={() => setVisibleDel(true)} 
                          label="Delete user" 
                          color="primary" 
                          clickable 
                        />
                        <Chip 
                          onClick={() => onClickDeleteChannel(channel._id)} 
                          label="Delete channel" 
                          color="primary" 
                          clickable 
                        />
                        <Modal
                          visible={visibleAdd}
                          title="Add user to channel"
                          onOk={() => onClickAddUser(channel._id)}
                          onCancel={() => setVisibleAdd(false)}
                          footer={[
                            <Button key="back" onClick={() => setVisibleAdd(false)}>
                              Return
                            </Button>,
                            <Button key="submit" type="primary" onClick={() => onClickAddUser(channel._id)}>
                              Submit
                            </Button>,
                          ]}
                        >
                          <Input 
                              className="mb-3"
                              value={inputValue} 
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder="Enter user's email" 
                          />
                        </Modal>
                        <Modal
                          visible={visibleDel}
                          title="Delete user"
                          onOk={() => onClickDeleteUser(channel._id)}
                          onCancel={() => setVisibleDel(false)}
                          footer={[
                            <Button key="back" onClick={() => setVisibleDel(false)}>
                              Return
                            </Button>,
                            <Button key="submit" type="primary" onClick={() => onClickDeleteUser(channel._id)}>
                              Submit
                            </Button>,
                          ]}
                        >
                          <Input 
                              className="mb-3"
                              value={inputValue} 
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder="Enter user's email" 
                          />
                        </Modal>
                      </span>
                    </span>
                    : ''
                  }
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

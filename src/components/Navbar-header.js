import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function NavbarHeader(props) {
    const { userImageUrl } = JSON.parse(localStorage.getItem('user'));
    const { setIsProfileOpen, sidebarOpen, setSidebarOpen } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    let history = useHistory();

    function onClickLogOut() {
        localStorage.clear();
        history.push('/signin');
    }

    function onClickShowProfile() {
        setIsProfileOpen(() => true);
    }

    return (
        <div className="Navbar-header">
            <div className="page-topbar d-flex justify-content-between align-items-center">
                <div onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn">
                    <img src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Flist.svg?v=1596545874905" alt="" />
                </div>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle>
                        <div className="header-profile">
                            <img 
                                className="rounded-circle header-profile-user" 
                                src={userImageUrl} 
                                alt="Header Avatar" 
                            />
                        </div>
                    </DropdownToggle>
                    <DropdownMenu right className="mt-2">
                        <DropdownItem onClick={onClickShowProfile}>Profile</DropdownItem>
                        <DropdownItem onClick={onClickLogOut}>Log out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
import React from 'react';
import { Menu } from 'antd';

const ProfileMenu = ({ onEdit, onLogout }) => {
    return (
        <Menu
            onClick={({ key }) => {
                if (key === 'editProfile') onEdit?.();
                if (key === 'logout') onLogout?.();
            }}
        >
            <Menu.Item key="editProfile">编辑个人资料</Menu.Item>
            <Menu.Item key="logout">退出登录</Menu.Item>
        </Menu>
    );
};

export default ProfileMenu;
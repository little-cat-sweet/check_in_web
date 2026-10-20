import React from 'react';
import { Dropdown } from 'antd';
import {
    DownOutlined,
    EditOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons';

const menuItems = [
    { key: 'editProfile', icon: <EditOutlined />, label: '编辑个人资料' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
];

const ProfileMenu = ({ name, onEdit, onLogout }) => {
    const handleMenuClick = ({ key }) => {
        if (key === 'editProfile') onEdit?.();
        if (key === 'logout') onLogout?.();
    };

    return (
        <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={['click']}
            arrow={{ pointAtCenter: true }}
        >
            <button type="button" className="profile-trigger" aria-label="账户菜单">
                <span className="profile-name">{name || '我的账号'}</span>
                <span className="profile-avatar" aria-hidden="true">
                    {name ? name.slice(0, 1).toUpperCase() : <UserOutlined />}
                </span>
                <DownOutlined className="profile-caret" />
            </button>
        </Dropdown>
    );
};

export default ProfileMenu;

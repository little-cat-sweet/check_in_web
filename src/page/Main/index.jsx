import React, { useEffect, useState } from 'react';
import { App as AntApp } from 'antd';
import {
    BarChartOutlined,
    CalendarOutlined,
    LineChartOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import Brand from '../../component/Brand';
import ProfileMenu from '../../component/ProfileMenu';
import CustomFooter from '../../component/CustomFooter';
import Target from '../../component/Target';
import Conclusion from '../../component/Conclusion';
import TargetItemContainer from '../../component/TargetItemContainer';
import httpUtil from '../../util/HttpUtil';

const TABS = [
    {
        key: 'today',
        icon: <LineChartOutlined />,
        label: '每日目标',
        title: '每日目标',
        sub: '勾选今天已经完成的事项，坚持会留下痕迹。',
    },
    {
        key: 'targets',
        icon: <BarChartOutlined />,
        label: '目标',
        title: '目标管理',
        sub: '设定提醒频率，让你想坚持的事按时出现。',
    },
    {
        key: 'summary',
        icon: <PieChartOutlined />,
        label: '总结',
        title: '打卡总结',
        sub: '回看每一天的完成情况，找到自己的节奏。',
    },
];

const Main = () => {
    const [activeTab, setActiveTab] = useState('today');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const { message } = AntApp.useApp();

    useEffect(() => {
        let active = true;
        httpUtil
            .getRequest('/user/userInfo')
            .then((res) => {
                if (active && res?.success) {
                    setUserName(res.data?.name || '');
                }
            })
            .catch(() => {
                // 顶部昵称属于装饰信息，获取失败时静默降级
            });
        return () => {
            active = false;
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authorization');
        message.success('已退出登录');
        navigate('/login');
    };

    const currentTab = TABS.find((tab) => tab.key === activeTab) || TABS[0];

    const renderContent = () => {
        switch (activeTab) {
            case 'today':
                return <TargetItemContainer onCreateTarget={() => setActiveTab('targets')} />;
            case 'targets':
                return <Target />;
            case 'summary':
                return <Conclusion />;
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="app-header__inner">
                    <Brand />

                    <nav className="app-nav" aria-label="主导航">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={`nav-pill${activeTab === tab.key ? ' is-active' : ''}`}
                                aria-current={activeTab === tab.key ? 'page' : undefined}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon}
                                <span className="nav-pill__label">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="app-header__spacer" />

                    <ProfileMenu
                        name={userName}
                        onEdit={() => navigate('/editProfile')}
                        onLogout={handleLogout}
                    />
                </div>
            </header>

            <main className="app-main">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">{currentTab.title}</h1>
                        <p className="page-sub">{currentTab.sub}</p>
                    </div>
                    <span className="page-date">
                        <CalendarOutlined />
                        {dayjs().format('M 月 D 日 dddd')}
                    </span>
                </div>

                <div key={activeTab} className="rise">
                    {renderContent()}
                </div>
            </main>

            <CustomFooter />
        </div>
    );
};

export default Main;

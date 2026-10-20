import React from 'react';

const CustomFooter = () => (
    <footer className="app-footer">
        <div className="app-footer__inner">
            <span>© {new Date().getFullYear()} 打卡小工具 · 把每一天的小事做好</span>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                蜀ICP备2025170162号
            </a>
        </div>
    </footer>
);

export default CustomFooter;

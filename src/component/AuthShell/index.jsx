import React from 'react';
import Brand from '../Brand';

/**
 * 登录 / 注册 / 找回密码共用的页面骨架：
 * 左侧图片视觉区 + 右侧表单卡片，小屏时自动隐藏图片区。
 */
const AuthShell = ({ image, quote, caption, tagline, children }) => (
    <div className="auth">
        <aside className="auth__visual" style={{ backgroundImage: `url(${image})` }}>
            <Brand inverted tagline={tagline} />
            <div className="auth__quote">
                <p>{quote}</p>
                <span>{caption}</span>
            </div>
        </aside>

        <section className="auth__panel">
            <div className="auth__card rise">
                <div className="auth__brand">
                    <Brand tagline={tagline} />
                </div>
                {children}
            </div>
        </section>
    </div>
);

export default AuthShell;

import React from 'react';
import { CheckOutlined } from '@ant-design/icons';

/**
 * 品牌标识：渐变方块 + 名称 + 英文辅助文案。
 * inverted 用于深色背景（登录页左侧图片区）。
 */
const Brand = ({ inverted = false, tagline = 'DAILY CHECK-IN' }) => (
    <div className={`brand${inverted ? ' brand--inverted' : ''}`}>
        <span className="brand__mark" aria-hidden="true">
            <CheckOutlined />
        </span>
        <span className="brand__text">
            <span className="brand__name">打卡小工具</span>
            <span className="brand__tag">{tagline}</span>
        </span>
    </div>
);

export default Brand;

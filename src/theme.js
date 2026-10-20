/**
 * Ant Design 主题配置。
 * 品牌主色保持近黑（#17140f），画布使用暖调米白，与页面配图（暖光夜景）呼应。
 */
export const themeConfig = {
    token: {
        colorPrimary: '#17140f',
        colorInfo: '#17140f',
        colorLink: '#17140f',
        colorLinkHover: '#57534e',
        colorSuccess: '#16794c',
        colorWarning: '#a4580e',
        colorError: '#b42318',
        colorText: '#17140f',
        colorTextSecondary: '#4a453d',
        colorTextTertiary: '#8b847a',
        colorTextQuaternary: '#b3aca1',
        colorBorder: '#e3ddd3',
        colorBorderSecondary: '#efeae2',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f6f5f2',
        colorFillAlter: '#faf8f5',
        colorFillSecondary: '#f4f1ec',
        borderRadius: 10,
        borderRadiusLG: 14,
        borderRadiusSM: 8,
        controlHeight: 38,
        controlHeightLG: 46,
        fontSize: 14,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"PingFang SC"',
            '"Hiragino Sans GB"',
            '"Microsoft YaHei"',
            '"Noto Sans SC"',
            'sans-serif',
        ].join(', '),
        lineHeight: 1.6,
        boxShadow: '0 2px 6px rgba(23, 20, 15, 0.05), 0 18px 40px -26px rgba(23, 20, 15, 0.35)',
        boxShadowSecondary: '0 10px 30px -12px rgba(23, 20, 15, 0.22)',
    },
    components: {
        Button: {
            fontWeight: 600,
            controlHeight: 38,
            controlHeightLG: 46,
            primaryShadow: 'none',
            defaultShadow: 'none',
            dangerShadow: 'none',
        },
        Input: {
            controlHeight: 40,
            controlHeightLG: 46,
            paddingInline: 14,
            activeShadow: '0 0 0 3px rgba(23, 20, 15, 0.08)',
            hoverBorderColor: '#c9c1b5',
        },
        Select: {
            controlHeight: 40,
            controlHeightLG: 46,
            optionSelectedBg: '#f4f1ec',
        },
        Table: {
            headerBg: '#faf8f5',
            headerColor: '#8b847a',
            headerSplitColor: 'transparent',
            borderColor: '#efeae2',
            rowHoverBg: '#faf8f5',
            cellPaddingBlock: 14,
            cellPaddingInline: 16,
        },
        Modal: {
            borderRadiusLG: 20,
            titleFontSize: 17,
            paddingContentHorizontalLG: 24,
        },
        Card: {
            borderRadiusLG: 20,
        },
        Pagination: {
            itemActiveBg: '#f4f1ec',
        },
        Segmented: {
            trackBg: '#f4f1ec',
            itemSelectedBg: '#ffffff',
            itemSelectedColor: '#17140f',
            trackPadding: 3,
        },
        Dropdown: {
            paddingBlock: 6,
        },
        Message: {
            contentPadding: '10px 16px',
        },
    },
};

export default themeConfig;

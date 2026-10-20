import React, { useEffect, useMemo, useState } from 'react';
import { App as AntApp, Calendar, Modal, Segmented, Select, Skeleton } from 'antd';
import { CheckCircleFilled, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import httpUtil from '../../util/HttpUtil';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
    label: `${index + 1} 月`,
    value: index,
}));

const Conclusion = () => {
    const { message } = AntApp.useApp();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            try {
                const res = await httpUtil.getRequest('/dash/getDashTargetItems');
                if (active) {
                    if (res.success) {
                        setItems(res.data || []);
                    } else {
                        message.error(res.message || '获取打卡记录失败');
                    }
                }
            } catch (error) {
                if (active) {
                    message.error('获取打卡记录失败，请稍后重试');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [message]);

    const yearOptions = useMemo(() => {
        const year = dayjs().year();
        return [year - 1, year].map((value) => ({ label: `${value} 年`, value }));
    }, []);

    const itemsOfDate = (value) => {
        const key = value.format('YYYY-MM-DD');
        return items.filter((item) => (item.createTime || '').startsWith(key));
    };

    const incompleteOfMonth = (value) =>
        items.filter(
            (item) => item.status === 0 && dayjs(item.createTime).isSame(value, 'month')
        ).length;

    const dateCellRender = (value) => {
        const list = itemsOfDate(value);
        if (list.length === 0) {
            return null;
        }

        const limit = list.length > 3 ? 2 : 3;
        const visible = list.slice(0, limit);
        const rest = list.length - visible.length;

        return (
            <div className="cal-cell">
                {visible.map((item) => (
                    <span
                        key={item.id}
                        className={`cal-item ${item.status === 1 ? 'is-done' : 'is-todo'}`}
                        title={item.name}
                    >
                        <i className="cal-item__dot" />
                        {item.name}
                    </span>
                ))}
                {rest > 0 ? <span className="cal-more">+{rest} 项</span> : null}
            </div>
        );
    };

    const monthCellRender = (value) => {
        const count = incompleteOfMonth(value);
        return count > 0 ? <span className="cal-month">{count} 项未完成</span> : null;
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') {
            return dateCellRender(current);
        }
        if (info.type === 'month') {
            return monthCellRender(current);
        }
        return info.originNode;
    };

    // 允许查看今年与去年（与年份下拉选项保持一致），不允许选择未来日期
    const disabledDate = (current) => {
        const earliest = dayjs().subtract(1, 'year').startOf('year');
        return current.isBefore(earliest, 'day') || current.isAfter(dayjs(), 'day');
    };

    const handleSelect = (value, info) => {
        if (info?.source !== 'date') {
            return;
        }
        const list = itemsOfDate(value);
        if (list.length === 0) {
            return;
        }
        setSelectedDate(value);
        setSelectedItems(list);
        setDetailOpen(true);
    };

    const headerRender = ({ value, type, onChange, onTypeChange }) => (
        <div className="cal-head">
            <div className="cal-head__title">
                {type === 'year' ? value.format('YYYY 年') : value.format('YYYY 年 M 月')}
            </div>
            <div className="cal-head__controls">
                <Select
                    size="small"
                    value={value.year()}
                    options={yearOptions}
                    onChange={(year) => onChange(value.set('year', year))}
                    popupMatchSelectWidth={false}
                    aria-label="选择年份"
                />
                <Select
                    size="small"
                    value={value.month()}
                    options={MONTH_OPTIONS}
                    onChange={(month) => onChange(value.set('month', month))}
                    popupMatchSelectWidth={false}
                    aria-label="选择月份"
                />
                <Segmented
                    size="small"
                    value={type}
                    options={[
                        { label: '月', value: 'month' },
                        { label: '年', value: 'year' },
                    ]}
                    onChange={onTypeChange}
                />
            </div>
        </div>
    );

    const doneInSelected = selectedItems.filter((item) => item.status === 1).length;

    return (
        <>
            <div className="card cal-shell">
                <div className="card__head">
                    <div>
                        <h2 className="card__title">打卡日历</h2>
                        <p className="card__sub">
                            {items.length > 0
                                ? '点击有记录的日期，查看当天的完成详情'
                                : '还没有打卡记录，完成每日目标后会出现在这里'}
                        </p>
                    </div>
                    <div className="cal-legend">
                        <span>
                            <i className="dot dot--done" />
                            已完成
                        </span>
                        <span>
                            <i className="dot dot--todo" />
                            未完成
                        </span>
                    </div>
                </div>

                <div className="card__body">
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 8 }} />
                    ) : (
                        <Calendar
                            fullscreen
                            cellRender={cellRender}
                            headerRender={headerRender}
                            disabledDate={disabledDate}
                            onSelect={handleSelect}
                        />
                    )}
                </div>
            </div>

            <Modal
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={null}
                width={520}
                centered
                title={selectedDate ? `${selectedDate.format('M 月 D 日')} 的打卡` : '打卡详情'}
            >
                <p className="card__sub" style={{ marginBottom: 8 }}>
                    共 {selectedItems.length} 项，已完成 {doneInSelected} 项
                </p>
                <div className="detail-list">
                    {selectedItems.map((item) => {
                        const isDone = item.status === 1;
                        return (
                            <div
                                key={item.id}
                                className={`detail-row${isDone ? ' is-done' : ''}`}
                            >
                                <span className="detail-icon" aria-hidden="true">
                                    {isDone ? <CheckCircleFilled /> : <ClockCircleOutlined />}
                                </span>
                                <div className="detail-main">
                                    <span className="check-title">{item.name}</span>
                                    <span className="check-desc">{item.description || '—'}</span>
                                </div>
                                <span className={`tag ${isDone ? 'tag--done' : 'tag--todo'}`}>
                                    <i className="dot" />
                                    {isDone ? '已完成' : '未完成'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        </>
    );
};

export default Conclusion;

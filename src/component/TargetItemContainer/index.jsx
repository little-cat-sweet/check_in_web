import React, { useCallback, useEffect, useState } from 'react';
import { App as AntApp, Button, Pagination, Skeleton } from 'antd';
import {
    CheckCircleOutlined,
    CheckOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import httpUtil from '../../util/HttpUtil';
import dateUtil from '../../util/DateUtil';
import AnimatedNumber from '../AnimatedNumber';

const PAGE_SIZE = 20;

const TargetItemContainer = ({ onCreateTarget }) => {
    const { message } = AntApp.useApp();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [pendingIds, setPendingIds] = useState(() => new Set());

    const markPending = useCallback((id, pending) => {
        setPendingIds((prev) => {
            const next = new Set(prev);
            if (pending) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    }, []);

    const applyStatus = useCallback((id, status) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
    }, []);

    const fetchItems = useCallback(
        async (pageNum) => {
            setLoading(true);
            try {
                const time = await dateUtil.getNowDate();
                const res = await httpUtil.getRequest(
                    `/targetItem/showTargetItemVo?time=${time}&pageNum=${pageNum}&pageSize=${PAGE_SIZE}`
                );
                if (res.success) {
                    const list = res.data || [];
                    setItems(list);
                    setTotal(res.pagination?.total ?? list.length);
                } else {
                    message.error(res.message || '获取打卡数据失败');
                }
            } catch (error) {
                message.error('获取打卡数据失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        },
        [message]
    );

    useEffect(() => {
        fetchItems(page);
    }, [fetchItems, page]);

    /**
     * 勾选采用「乐观更新」：先改本地状态让进度条平滑过渡，再发请求；
     * 失败时回滚。这里不重新拉取列表，避免 loading 期间顶部进度块被替换、列表变暗导致的跳动。
     */
    const toggleStatus = async (item) => {
        const wasDone = item.status === 1;
        const nextStatus = wasDone ? 0 : 1;

        if (pendingIds.has(item.id)) {
            return;
        }

        markPending(item.id, true);
        applyStatus(item.id, nextStatus);

        try {
            const endpoint = wasDone
                ? `/targetItem/cancel?id=${item.id}`
                : `/targetItem/confirmSuccess?id=${item.id}`;
            const res = await httpUtil.postRequest(endpoint);
            if (!res.success) {
                applyStatus(item.id, item.status);
                message.error(res.message || (wasDone ? '撤销失败' : '标记失败'));
            } else {
                message.success(wasDone ? '已撤销完成' : '已完成，继续保持');
            }
        } catch (error) {
            applyStatus(item.id, item.status);
            message.error('操作失败，请稍后重试');
        } finally {
            markPending(item.id, false);
        }
    };

    const doneCount = items.filter((item) => item.status === 1).length;
    const loadedAll = items.length === total;
    const percent = loadedAll && total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const remaining = total - doneCount;

    const renderEmpty = () => (
        <div className="empty-block">
            <div className="empty-block__icon">
                <CheckCircleOutlined />
            </div>
            <h2 className="empty-block__title">今天还没有打卡项</h2>
            <p className="empty-block__desc">
                创建一个目标并设定提醒频率，每天它都会准时出现在这里。
            </p>
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreateTarget}>
                去创建目标
            </Button>
        </div>
    );

    return (
        <div className="card">
            {total > 0 ? (
                <div className="summary">
                    <div className="summary__item">
                        <span className="summary__value">{total}</span>
                        <span className="summary__label">今日目标</span>
                    </div>

                    {loadedAll ? (
                        <>
                            <div className="summary__divider" />
                            <div className="summary__item">
                                <span className="summary__value">
                                    <AnimatedNumber value={doneCount} />
                                    <small>/ {total}</small>
                                </span>
                                <span className="summary__label">已完成</span>
                            </div>
                            <div className="summary__progress">
                                <div
                                    className="progress"
                                    role="progressbar"
                                    aria-valuenow={percent}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="今日完成度"
                                >
                                    <div
                                        className={`progress__bar${
                                            percent === 100 ? ' progress__bar--complete' : ''
                                        }`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                <span className="summary__hint">
                                    {percent === 100 ? (
                                        '今天的目标全部完成，做得很好 🎉'
                                    ) : (
                                        <>
                                            完成度 <AnimatedNumber value={percent} />%，还差{' '}
                                            <AnimatedNumber value={remaining} /> 项
                                        </>
                                    )}
                                </span>
                            </div>
                        </>
                    ) : (
                        <span className="summary__hint">
                            共 {total} 项，当前为第 {page} 页
                        </span>
                    )}
                </div>
            ) : null}

            {loading && items.length === 0 ? (
                <div className="card__body">
                    <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 5, width: ['62%', '78%', '54%', '70%', '44%'] }}
                    />
                </div>
            ) : items.length === 0 ? (
                renderEmpty()
            ) : (
                <div className={`checklist${loading ? ' is-loading' : ''}`}>
                    {items.map((item) => {
                        const isDone = item.status === 1;
                        const pending = pendingIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className={`check-row${isDone ? ' check-row--done' : ''}`}
                                aria-busy={pending || undefined}
                            >
                                <button
                                    type="button"
                                    className="check-toggle"
                                    aria-pressed={isDone}
                                    aria-label={isDone ? `撤销完成：${item.name}` : `标记完成：${item.name}`}
                                    disabled={pending}
                                    onClick={() => toggleStatus(item)}
                                >
                                    <CheckOutlined />
                                </button>

                                <div className="check-main">
                                    <span className="check-title">{item.name}</span>
                                    {item.description ? (
                                        <span className="check-desc">{item.description}</span>
                                    ) : null}
                                </div>

                                <div className="check-side">
                                    <span className={`tag ${isDone ? 'tag--done' : 'tag--todo'}`}>
                                        <i className="dot" />
                                        {isDone ? '已完成' : '未完成'}
                                    </span>
                                    <button
                                        type="button"
                                        className="link-btn"
                                        disabled={pending}
                                        onClick={() => toggleStatus(item)}
                                    >
                                        {isDone ? '撤销' : '完成'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {total > PAGE_SIZE ? (
                <div className="card__foot">
                    <Pagination
                        current={page}
                        pageSize={PAGE_SIZE}
                        total={total}
                        showSizeChanger={false}
                        onChange={(nextPage) => setPage(nextPage)}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default TargetItemContainer;

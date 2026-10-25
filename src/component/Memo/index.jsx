import React, { useCallback, useEffect, useState } from 'react';
import {
    App as AntApp,
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Table,
    TimePicker,
} from 'antd';
import { BellOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import httpUtil from '../../util/HttpUtil';

const PAGE_SIZE = 8;

const PRIORITY_META = {
    1: { label: '高', className: 'tag--high' },
    2: { label: '中', className: 'tag--mid' },
    3: { label: '低', className: 'tag--low' },
};

const PRIORITY_OPTIONS = [
    { label: '高（每天提醒 5 次）', value: 1 },
    { label: '中（每天提醒 3 次）', value: 2 },
    { label: '低（每天提醒 1 次）', value: 3 },
];

const TODAY_STATUS_META = {
    acked: { label: '今天已知晓', className: 'tag--done' },
    finished: { label: '今天已提醒完', className: 'tag--neutral' },
    running: { label: '提醒中', className: 'tag--todo' },
};

const defaultRemindTime = () => {
    const next = dayjs().add(1, 'hour').minute(0).second(0);
    return next;
};

const Memo = () => {
    const [form] = Form.useForm();
    const { message } = AntApp.useApp();

    const [memos, setMemos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [actingId, setActingId] = useState(null);

    const flushData = useCallback(
        async (pageNum, size) => {
            setLoading(true);
            try {
                const res = await httpUtil.getRequest(
                    `/memo/list?pageNum=${pageNum}&pageSize=${size}`
                );
                if (res.success) {
                    const list = res.data || [];
                    setMemos(list);
                    setTotal(res.pagination?.total ?? list.length);
                } else {
                    message.error(res.message || '查询备忘录失败');
                }
            } catch (error) {
                message.error('查询备忘录失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        },
        [message]
    );

    useEffect(() => {
        flushData(currentPage, pageSize);
    }, [flushData, currentPage, pageSize]);

    // Modal 打开后再回填表单：destroyOnClose 下 Form 此时才挂载
    useEffect(() => {
        if (!modalOpen) {
            return;
        }
        if (editing) {
            form.setFieldsValue({
                title: editing.title,
                content: editing.content,
                priority: editing.priority,
                intervalMinutes: editing.intervalMinutes,
                remindTime: dayjs(`2000-01-01 ${editing.remindTime}`),
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                priority: 1,
                intervalMinutes: 60,
                remindTime: defaultRemindTime(),
            });
        }
    }, [modalOpen, editing, form]);

    const openAddModal = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditing(record);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

    const submitMemo = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                title: values.title,
                content: values.content,
                priority: values.priority,
                remindTime: values.remindTime.format('HH:mm'),
                intervalMinutes: values.intervalMinutes,
            };
            const res = editing
                ? await httpUtil.postRequest('/memo/update', { ...payload, id: editing.id })
                : await httpUtil.postRequest('/memo/add', payload);

            if (res.success) {
                message.success(editing ? '备忘录已更新' : '备忘录已添加');
                closeModal();
                if (currentPage === 1) {
                    await flushData(1, pageSize);
                } else {
                    setCurrentPage(1);
                }
            } else {
                message.error(res.message || '保存失败');
            }
        } catch (error) {
            message.error('保存失败，请稍后重试');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAck = async (record) => {
        setActingId(record.id);
        try {
            const res = await httpUtil.postRequest(`/memo/ack?id=${record.id}`);
            if (res.success) {
                message.success('今天不再提醒，明天照常');
                await flushData(currentPage, pageSize);
            } else {
                message.error(res.message || '操作失败');
            }
        } catch (error) {
            message.error('操作失败，请稍后重试');
        } finally {
            setActingId(null);
        }
    };

    const handleComplete = async (record) => {
        setActingId(record.id);
        try {
            const res = await httpUtil.postRequest(`/memo/delete?id=${record.id}`);
            if (res.success) {
                message.success('备忘录已完成并删除');
                const nextPage =
                    memos.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                if (nextPage === currentPage) {
                    await flushData(currentPage, pageSize);
                } else {
                    setCurrentPage(nextPage);
                }
            } else {
                message.error(res.message || '操作失败');
            }
        } catch (error) {
            message.error('操作失败，请稍后重试');
        } finally {
            setActingId(null);
        }
    };

    const columns = [
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 92,
            render: (priority) => {
                const meta = PRIORITY_META[priority] || PRIORITY_META[3];
                return <span className={`tag ${meta.className}`}>{meta.label}</span>;
            },
        },
        {
            title: '备忘录',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            render: (title, record) => (
                <div className="memo-main">
                    <span className="cell-strong">{title}</span>
                    {record.content ? (
                        <span className="cell-muted cell-ellipsis">{record.content}</span>
                    ) : null}
                </div>
            ),
        },
        {
            title: '提醒设置',
            key: 'plan',
            width: '26%',
            render: (_, record) => (
                <div className="memo-plan">
                    <span className="tag tag--neutral">
                        <ClockCircleOutlined />
                        每天 {record.remindTime}
                    </span>
                    <span className="cell-muted">间隔 {record.intervalMinutes} 分钟</span>
                </div>
            ),
        },
        {
            title: '今天',
            key: 'today',
            width: 156,
            render: (_, record) => {
                const meta = TODAY_STATUS_META[record.todayStatus] || TODAY_STATUS_META.running;
                return (
                    <div className="memo-today">
                        <span className="cell-strong">
                            {record.todaySent || 0}/{record.maxTimes || 1}
                        </span>
                        <span className={`tag ${meta.className}`}>{meta.label}</span>
                    </div>
                );
            },
        },
        {
            title: '操作',
            key: 'action',
            width: 210,
            align: 'right',
            render: (_, record) => {
                const busy = actingId === record.id;
                return (
                    <div className="memo-actions">
                        <button
                            type="button"
                            className="link-btn"
                            disabled={busy || record.todayStatus === 'acked'}
                            onClick={() => handleAck(record)}
                        >
                            已知晓
                        </button>
                        <button
                            type="button"
                            className="link-btn"
                            disabled={busy}
                            onClick={() => openEditModal(record)}
                        >
                            编辑
                        </button>
                        <Popconfirm
                            title="完成这个备忘录？"
                            description="完成后备忘录会被删除，之后不再提醒。"
                            okText="完成并删除"
                            cancelText="取消"
                            okButtonProps={{ danger: true, loading: busy }}
                            onConfirm={() => handleComplete(record)}
                        >
                            <button
                                type="button"
                                className="link-btn link-btn--danger"
                                disabled={busy}
                            >
                                完成
                            </button>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    const renderEmpty = () => (
        <div className="empty-block">
            <div className="empty-block__icon">
                <BellOutlined />
            </div>
            <h2 className="empty-block__title">还没有任何备忘录</h2>
            <p className="empty-block__desc">
                添加一条备忘录，设定优先级、每天提醒时间和间隔，到点会用邮件提醒你。
            </p>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                新建备忘录
            </Button>
        </div>
    );

    return (
        <>
            <div className="card card--flush">
                <div className="card__head">
                    <div>
                        <h2 className="card__title">全部备忘录</h2>
                        <p className="card__sub">
                            共 {total} 条，每天按设定时间提醒；高优先级 5 次、中 3 次、低 1 次
                        </p>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                        新建备忘录
                    </Button>
                </div>

                <div className="card__body card__body--flush">
                    {!loading && memos.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <Table
                            className="data-table"
                            dataSource={memos}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            scroll={{ x: 820 }}
                            locale={{ emptyText: ' ' }}
                            pagination={{
                                current: currentPage,
                                pageSize,
                                total,
                                showSizeChanger: false,
                                hideOnSinglePage: true,
                                onChange: (page, size) => {
                                    setCurrentPage(page);
                                    setPageSize(size);
                                },
                            }}
                        />
                    )}
                </div>
            </div>

            <Modal
                open={modalOpen}
                onCancel={closeModal}
                footer={null}
                title={editing ? '编辑备忘录' : '新建备忘录'}
                width={500}
                centered
                destroyOnClose
            >
                <p className="card__sub" style={{ marginBottom: 18 }}>
                    每天到点后按间隔重复提醒，优先级决定每天最多提醒几次。
                </p>
                <Form form={form} layout="vertical" requiredMark={false} onFinish={submitMemo}>
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[
                            { required: true, message: '请输入备忘录标题' },
                            { max: 100, message: '标题最多 100 个字符' },
                        ]}
                    >
                        <Input placeholder="例如：给客户回电话" maxLength={100} />
                    </Form.Item>

                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ max: 1000, message: '内容最多 1000 个字符' }]}
                    >
                        <Input.TextArea
                            placeholder="补充说明（选填）"
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            maxLength={1000}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        label="优先级"
                        name="priority"
                        rules={[{ required: true, message: '请选择优先级' }]}
                    >
                        <Select options={PRIORITY_OPTIONS} />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <Form.Item
                            label="每天提醒时间"
                            name="remindTime"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: '请选择提醒时间' }]}
                        >
                            <TimePicker format="HH:mm" minuteStep={1} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="提醒间隔"
                            name="intervalMinutes"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: '请输入提醒间隔' }]}
                        >
                            <InputNumber
                                min={1}
                                max={1440}
                                precision={0}
                                style={{ width: '100%' }}
                                addonAfter="分钟"
                            />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 22 }}>
                        <Button onClick={closeModal}>取消</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            {editing ? '保存修改' : '保存备忘录'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default Memo;

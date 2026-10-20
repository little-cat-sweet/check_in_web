import React, { useCallback, useEffect, useState } from 'react';
import {
    App as AntApp,
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Table,
} from 'antd';
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import httpUtil from '../../util/HttpUtil';

const PAGE_SIZE = 8;

const DAY_OPTIONS = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期天', value: 7 },
    { label: '每日', value: 0 },
];

const dayLabel = (value) => DAY_OPTIONS.find((option) => option.value === value)?.label;

const Target = () => {
    const [form] = Form.useForm();
    const { message } = AntApp.useApp();

    const [targets, setTargets] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const flushData = useCallback(
        async (pageNum, size) => {
            setLoading(true);
            try {
                const res = await httpUtil.getRequest(
                    `/target/findTargets?pageNum=${pageNum}&pageSize=${size}`
                );
                if (res.success) {
                    const list = res.data || [];
                    setTargets(list);
                    setTotal(res.pagination?.total ?? list.length);
                } else {
                    message.error(res.message || '查询目标失败');
                }
            } catch (error) {
                message.error('查询目标失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        },
        [message]
    );

    useEffect(() => {
        flushData(currentPage, pageSize);
    }, [flushData, currentPage, pageSize]);

    const openModal = () => setModalOpen(true);

    const closeModal = () => {
        setModalOpen(false);
        form.resetFields();
    };

    const addTarget = async (values) => {
        setSubmitting(true);
        try {
            const res = await httpUtil.postRequest('/target/add', values);
            if (res.success) {
                message.success('目标已添加');
                closeModal();
                if (currentPage === 1) {
                    await flushData(1, pageSize);
                } else {
                    setCurrentPage(1);
                }
            } else {
                message.error(res.message || '添加失败');
            }
        } catch (error) {
            message.error('添加失败，请稍后重试');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record) => {
        setDeletingId(record.id);
        try {
            const res = await httpUtil.postRequest(`/target/delete?id=${record.id}`);
            if (res.success) {
                message.success('目标已删除');
                const nextPage =
                    targets.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                if (nextPage === currentPage) {
                    await flushData(currentPage, pageSize);
                } else {
                    setCurrentPage(nextPage);
                }
            } else {
                message.error(res.message || '删除失败');
            }
        } catch (error) {
            message.error('删除失败，请稍后重试');
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'name',
            key: 'name',
            width: '26%',
            render: (name) => <span className="cell-strong">{name}</span>,
        },
        {
            title: '内容',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            render: (description) => (
                <span className="cell-muted cell-ellipsis">{description || '—'}</span>
            ),
        },
        {
            title: '提醒频率',
            dataIndex: 'day',
            key: 'day',
            width: '24%',
            render: (day) => (
                <span className="tag tag--neutral">
                    <ClockCircleOutlined />
                    {dayLabel(day) || '未知'}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: '20%',
            align: 'right',
            render: (_, record) => (
                <Popconfirm
                    title="删除这个目标？"
                    description="删除后不可恢复，历史打卡记录不受影响。"
                    okText="删除"
                    cancelText="取消"
                    okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    onConfirm={() => handleDelete(record)}
                >
                    <button
                        type="button"
                        className="link-btn link-btn--danger"
                        disabled={deletingId === record.id}
                    >
                        删除
                    </button>
                </Popconfirm>
            ),
        },
    ];

    const renderEmpty = () => (
        <div className="empty-block">
            <div className="empty-block__icon">
                <ClockCircleOutlined />
            </div>
            <h2 className="empty-block__title">还没有任何目标</h2>
            <p className="empty-block__desc">
                添加第一个目标，设定提醒频率，从今天开始每天打卡。
            </p>
            <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
                新增目标
            </Button>
        </div>
    );

    return (
        <>
            <div className="card card--flush">
                <div className="card__head">
                    <div>
                        <h2 className="card__title">全部目标</h2>
                        <p className="card__sub">
                            共 {total} 个目标，按提醒频率每天自动出现在打卡列表
                        </p>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
                        新增目标
                    </Button>
                </div>

                <div className="card__body card__body--flush">
                    {!loading && targets.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <Table
                            className="data-table"
                            dataSource={targets}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            scroll={{ x: 620 }}
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
                title="新增目标"
                width={460}
                centered
            >
                <p className="card__sub" style={{ marginBottom: 18 }}>
                    设定标题与提醒频率，之后每天都会生成对应的打卡项。
                </p>
                <Form form={form} layout="vertical" requiredMark={false} onFinish={addTarget}>
                    <Form.Item
                        label="目标标题"
                        name="name"
                        rules={[
                            { required: true, message: '请输入目标标题' },
                            { max: 30, message: '标题最多 30 个字符' },
                        ]}
                    >
                        <Input placeholder="例如：阅读 20 分钟" maxLength={30} />
                    </Form.Item>

                    <Form.Item
                        label="目标内容"
                        name="description"
                        rules={[
                            { required: true, message: '请输入目标内容' },
                            { max: 30, message: '内容最多 30 个字符' },
                        ]}
                    >
                        <Input placeholder="简单描述这个目标" maxLength={30} />
                    </Form.Item>

                    <Form.Item
                        label="提醒频率"
                        name="day"
                        rules={[{ required: true, message: '请选择提醒频率' }]}
                    >
                        <Select placeholder="选择提醒频率" options={DAY_OPTIONS} />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 22 }}>
                        <Button onClick={closeModal}>取消</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            保存目标
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default Target;

import React, { useEffect, useState } from "react";
import httpUtil from "../../util/HttpUtil";
import dateUtil from "../../util/DateUtil";
import { message, Space, Table } from 'antd';

const columns = (handleConfirmComplete, cancel) => [
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
        render: (text) => text,
    },
    {
        title: '内容',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            return status === 1 ? '已完成' : '未完成';
        },
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                {record.status === 0 && (
                    <a onClick={() => handleConfirmComplete(record.id)}>标记完成</a>
                )}
                {record.status === 1 && (
                    <a onClick={() => cancel(record.id)}>取消完成</a>
                )}
            </Space>
        ),
    },
];

const TargetItemContainer = () => {
    const [targetItems, setTargetItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);

    const getTargetItemsByTime = async (time) => {
        const url = `/targetItem/showTargetItemVo?time=${time}&pageNum=${currentPage}&pageSize=${pageSize}`;
        return await httpUtil.getRequest(url);
    };

    const handleConfirmComplete = async (id) => {
        const res = await httpUtil.postRequest('/targetItem/confirmSuccess?id=' + id);
        if (res.success) {
            await flushTargetItems();
            message.success("标记完成成功");
        } else {
            message.error("标记完成失败");
        }
    };

    const cancel = async (id) => {
        const res = await httpUtil.postRequest('/targetItem/cancel?id=' + id);
        if (res.success) {
            await flushTargetItems();
            message.success("取消完成成功");
        } else {
            message.error("取消完成失败");
        }
    };

    const flushTargetItems = async () => {
        const time = await dateUtil.getNowDate();
        const res = await getTargetItemsByTime(time);
        if (res.success) {
            setTargetItems(res.data);
            setTotal(res.pagination.total);
        } else {
            message.error("获取数据失败");
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        flushTargetItems();
    };

    useEffect(() => {
        const fetchDate = async () => {
            try {
                const time = await dateUtil.getNowDate();
                const res = await getTargetItemsByTime(time);
                if (res.success) {
                    setTargetItems(res.data);
                    setTotal(res.pagination.total);
                }
            } catch (error) {
                console.error("获取数据错误:", error);
                message.error("获取数据错误");
            }
        };
        fetchDate();
    }, []);

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: handleTableChange,
        onShowSizeChange: (current, size) => {
            setCurrentPage(current);
            setPageSize(size);
            flushTargetItems();
        },
    };

    return (
        <div>
            <Table
                columns={columns(handleConfirmComplete, cancel)}
                dataSource={targetItems}
                rowKey="id"
                pagination={paginationConfig}
            />
        </div>
    );
};

export default TargetItemContainer;
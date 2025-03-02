import React, {useEffect, useState} from "react";
import httpUtil from "../../util/HttpUtil";
import dateUtil from "../../util/DateUtil"
import {message, Space, Table} from 'antd';

const columns = (handleConfirmComplete, cancel) => [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) =>{return text},
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            return status === 1 ? '完成' : '未完成';
        },
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                {record.status === 0 && (
                    <a onClick={() => handleConfirmComplete(record.id)}>Confirm Complete</a>
                )}
                {record.status === 1 && (
                    <a onClick={() => cancel(record.id)}>undo</a>
                )}
            </Space>
        ),
    },
];
const TargetItemContainer = () => {
    const [targetItems, setTargetItems] = useState([]);

    const getTargetItemsByTime = async (time) => {
        return await httpUtil.getRequest('/targetItem/showTargetItemVo' + '?time=' + time);
    };

    const handleConfirmComplete = async (id) => {
        const res = await httpUtil.postRequest('/targetItem/confirmSuccess?id=' + id);
        if (res.success) {
            await flushTargetItems();
        } else {
            message.error("confirm failed.")
        }
    }

    const cancel = async (id) => {
        const res = await httpUtil.postRequest('/targetItem/cancel?id=' + id);
        console.log(JSON.stringify(res))
        if (res.success) {
            await flushTargetItems()
        } else {
            message.error("cancel failed.")
        }
    }

    const flushTargetItems = async () => {
        const time = await dateUtil.getNowDate();
        const res = await getTargetItemsByTime(time)
        if (res.success) {
            setTargetItems(res.data)
        } else {
            message.error("fetch error")
        }
    }


    useEffect(() => {
        const fetchDate = async () => {
            try {
                const time = await dateUtil.getNowDate();
                const res = await getTargetItemsByTime(time)
                const items = await res.data
                if (items != null) {
                    setTargetItems(items);
                }
            } catch (error) {
                console.error("Error fetching date:", error);
            }
        };
        fetchDate();
    }, []);

    return (
        <div>
            <Table columns={columns(handleConfirmComplete, cancel)} dataSource={targetItems} rowKey="id"/>
        </div>
    );
};

export default TargetItemContainer;
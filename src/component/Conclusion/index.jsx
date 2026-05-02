import React, { useEffect, useState } from 'react';
import { Calendar, message, Modal, Table } from 'antd';
import httpUtil from "../../util/HttpUtil";
import moment from 'moment';
import './index.css';

const Conclusion = () => {
    const [conclusionItems, setConclusionItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedDateItems, setSelectedDateItems] = useState([]);

    const getMonthData = value => {
        const year = value.year();
        const month = value.month() + 1;
        return conclusionItems.filter(item => {
            const itemDate = moment(item.createTime);
            return itemDate.year() === year && itemDate.month() + 1 === month && item.status === 0;
        }).length;
    };

    useEffect(() => {
        flushConclusionItems();
    }, []);

    const flushConclusionItems = async () => {
        const res = await httpUtil.getRequest(`/dash/getDashTargetItems`);
        if (res.success) {
            setConclusionItems(res.data);
        } else {
            message.error(res.message);
        }
    };

    const getListData = value => {
        const dateStr = value.format('YYYY-MM-DD');
        return conclusionItems.filter(item => item.createTime.startsWith(dateStr));
    };

    const monthCellRender = value => {
        const num = getMonthData(value);
        return num > 0 ? (
            <div className="notes-month">
                <span>未完成项数 : {num}</span>
            </div>
        ) : null;
    };

    const dateCellRender = value => {
        const listData = getListData(value);
        const hasItems = listData.length > 0;

        const hasIncompleteItems = listData.some(item => item.status === 0);
        return (
            <div
                className={`date-cell ${hasItems ? 'has-items' : ''} ${hasIncompleteItems ? 'has-incomplete-items' : ''}`}
                onClick={() => {
                    if (hasItems) {
                        setSelectedDateItems(listData);
                        setVisible(true);
                    }
                }}
            >
                {listData.map(item => (
                    <li key={item.id} className={item.status === 0 ? 'incomplete-item' : ''}>
                        <p>{item.name}</p>
                    </li>
                ))}
            </div>
        );
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    const startOfYear = moment().startOf('year');
    const today = moment();

    const disabledDate = (current) => {
        return current.isBefore(startOfYear) || current.isAfter(today);
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: status => status === 1 ? <span style={{ color: '#52c41a' }}>完成</span> : <span style={{ color: '#ff4d4f' }}>未完成</span>,
        },
    ];

    return (
        <>
            <Calendar cellRender={cellRender} disabledDate={disabledDate}/>
            <Modal
                title="项目详情"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                style={{maxHeight: '80vh'}}
            >
                <Table
                    columns={columns}
                    dataSource={selectedDateItems.map(item => ({ ...item, key: item.id }))}
                    pagination={false}
                    bordered
                    size="small"
                    style={{ maxHeight: '60vh', overflowY: 'auto' }}
                    rowClassName={() => 'table-row-center'}
                />
            </Modal>
        </>
    );
};

export default Conclusion;
import {useEffect, useState} from "react";
import httpUtil from "../../util/HttpUtil";
import {Button, Col, Flex, Input, Layout, message, Modal, Row, Select, Table} from "antd";
import {Content, Header} from "antd/es/layout/layout";

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#fff',
};

const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#fff',
};

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(100% - 8px)',
    maxWidth: 'calc(100% - 8px)',
};


const Target = () => {

    const [targets, setTargets] = useState([])
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [day, setDay] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);

    const dayOptions = [
        {label: 'Monday', value: 1},
        {label: 'Tuesday', value: 2},
        {label: 'Wednesday', value: 3},
        {label: 'Thursday', value: 4},
        {label: 'Friday', value: 5},
        {label: 'Saturday', value: 6},
        {label: 'Sunday', value: 7},
        {label: 'Everyday', value: 0}
    ];
    useEffect(() => {
        flushData()
    }, [currentPage, pageSize])

    const showModal = () => {
        setVisible(true);
    };

    const handleName = (e) => {
        setName(e.target.value);
    };
    const handleDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleDay = (e) => {
        setDay(e)
    }

    const handleCancel = () => {
        setVisible(false);
        setName('');
        setDescription('')
        setDay(0);
    };

    const flushData = async () => {
        const res = await httpUtil.getRequest(`/target/findTargets?pageNum=${currentPage}&pageSize=${pageSize}`);
        if (res.success) {
            setTargets(res.data);
            setTotal(res.pagination.total)
        } else {
            message.error("find target failed")
        }
    }

    const addTarget = async () => {
        const target = {};
        if (null === name || '' === name) {
            message.warning("pls input name");
        }
        target.name = name;
        target.description = description;
        target.day = day;
        const res = await httpUtil.postRequest("/target/add", target);
        if (res.success) {
            message.info(res.message)
            await flushData()
            handleCancel();
        } else {
            message.error(res.message);
            handleCancel();
        }
    }

    // 定义表格列
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
            render: (dayValue) => {
                const option = dayOptions.find((option) => option.value === dayValue);
                return option ? option.label : 'Unknown';
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const handleDelete = async (e) => {

        const res = await httpUtil.postRequest("/target/delete?id=" + e.id);
        if (res.success) {
            await flushData();
            message.info("delete successfully")
        } else {
            message.error(res.message)
        }
    };

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
        },
    };

    return (
        <div>
            <Flex gap="middle" wrap>
                <Layout style={layoutStyle}>
                    <Header style={headerStyle}>
                        <Row>
                            <Col span={8}>
                                <Button type="primary" onClick={showModal}>
                                    添加target
                                </Button>
                                <Modal
                                    title="Adding target"
                                    visible={visible}
                                    onCancel={handleCancel}
                                    footer={[
                                        <Button key="cancel" onClick={handleCancel}>cancel</Button>,
                                        <Button key="confirm" type="primary" onClick={addTarget}>confirm</Button>
                                    ]}
                                >
                                    <Input
                                        placeholder="pls input target name"
                                        value={name}
                                        onChange={handleName}
                                    />
                                    <Input
                                        placeholder="pls input target description"
                                        value={description}
                                        onChange={handleDescription}
                                    />

                                    <Select
                                        placeholder="Select a type"
                                        value={day}
                                        onChange={handleDay}
                                        style={{width: '100%'}}
                                    >
                                        {dayOptions.map((option) => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Modal>
                            </Col>
                            <Col span={8}>col-8</Col>
                            <Col span={8}>col-8</Col>
                        </Row>
                    </Header>
                    <Content style={{...contentStyle, lineHeight: 'normal', padding: 20}}>
                        <Table dataSource={targets} columns={columns} rowKey="id" pagination={paginationConfig}/>
                    </Content>
                </Layout>
            </Flex>
        </div>)
}

export default Target;

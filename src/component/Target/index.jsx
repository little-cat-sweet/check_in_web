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
        {label: '星期一', value: 1},
        {label: '星期二', value: 2},
        {label: '星期三', value: 3},
        {label: '星期四', value: 4},
        {label: '星期五', value: 5},
        {label: '星期六', value: 6},
        {label: '星期天', value: 7},
        {label: '每日', value: 0}
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
            message.error("查询目标失败")
        }
    }

    const addTarget = async () => {
        const target = {};
        if (null === name || '' === name) {
            message.warning("请输入名称");
            return; // 添加返回，防止继续执行
        }
        target.name = name;
        target.description = description;
        target.day = day;

        const res = await httpUtil.postRequest("/target/add", target);
        if (res.success) {
            message.info("添加成功")
            await flushData()
            handleCancel();
        } else {
            message.error(res.message || "添加失败");
            handleCancel();
        }
    }

    // 定义表格列
    const columns = [
        {
            title: '标题',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '内容',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '提醒频率',
            dataIndex: 'day',
            key: 'day',
            render: (dayValue) => {
                const option = dayOptions.find((option) => option.value === dayValue);
                return option ? option.label : '未知';
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        删除
                    </Button>
                </div>
            ),
        },
    ];

    const handleDelete = async (e) => {
        const res = await httpUtil.postRequest("/target/delete?id=" + e.id);
        if (res.success) {
            await flushData();
            message.info("删除成功")
        } else {
            message.error(res.message || "删除失败")
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
                                    添加目标
                                </Button>
                                <Modal
                                    title="添加目标"
                                    visible={visible}
                                    onCancel={handleCancel}
                                    footer={[
                                        <Button key="cancel" onClick={handleCancel}>取消</Button>,
                                        <Button key="confirm" type="primary" onClick={addTarget}>确认</Button>
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入目标标题"
                                        value={name}
                                        onChange={handleName}
                                    />
                                    <Input
                                        placeholder="请输入目标内容"
                                        value={description}
                                        onChange={handleDescription}
                                    />

                                    <Select
                                        placeholder="选择提醒频率"
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
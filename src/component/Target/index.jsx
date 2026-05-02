import {useEffect, useState} from "react";
import httpUtil from "../../util/HttpUtil";
import {Button, Col, Flex, Input, Layout, message, Modal, Row, Select, Table} from "antd";
import {Content, Header} from "antd/es/layout/layout";

const headerStyle = {
    textAlign: 'center',
    color: '#000', // 黑色文字
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#fff', // 白色背景
    borderBottom: '1px solid #000', // 黑色边框
};

const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#000', // 黑色文字
    backgroundColor: '#fff', // 白色背景
    padding: '20px',
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(100% - 8px)',
    maxWidth: 'calc(100% - 8px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // 黑色阴影
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
            return;
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

    const columns = [
        {
            title: '标题',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: '内容',
            dataIndex: 'description',
            key: 'description',
            width: '25%',
        },
        {
            title: '提醒频率',
            dataIndex: 'day',
            key: 'day',
            width: '25%',
            render: (dayValue) => {
                const option = dayOptions.find((option) => option.value === dayValue);
                return option ? option.label : '未知';
            },
        },
        {
            title: '操作',
            key: 'action',
            width: '25%',
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
                                <Button type="primary" onClick={showModal} style={{ backgroundColor: '#000', color: '#fff', borderColor: '#000' }}>
                                    添加目标
                                </Button>
                                <Modal
                                    title="添加目标"
                                    visible={visible}
                                    onCancel={handleCancel}
                                    footer={[
                                        <Button
                                            key="cancel"
                                            onClick={handleCancel}
                                            style={{
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                borderColor: '#000',
                                                marginRight: 8
                                            }}
                                        >
                                            取消
                                        </Button>,
                                        <Button
                                            key="confirm"
                                            type="primary"
                                            onClick={addTarget}
                                            style={{
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                borderColor: '#000'
                                            }}
                                        >
                                            确认
                                        </Button>
                                    ]}
                                    style={{ borderRadius: 8 }}
                                    bodyStyle={{ padding: 24 }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div>
                                            <div style={{
                                                marginBottom: 8,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: '#333'
                                            }}>
                                                目标标题
                                            </div>
                                            <Input
                                                placeholder="请输入目标标题"
                                                value={name}
                                                onChange={handleName}
                                                style={{
                                                    height: 40,
                                                    borderRadius: 4,
                                                    borderColor: '#ddd'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <div style={{
                                                marginBottom: 8,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: '#333'
                                            }}>
                                                目标内容
                                            </div>
                                            <Input
                                                placeholder="请输入目标内容"
                                                value={description}
                                                onChange={handleDescription}
                                                style={{
                                                    height: 40,
                                                    borderRadius: 4,
                                                    borderColor: '#ddd'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <div style={{
                                                marginBottom: 8,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: '#333'
                                            }}>
                                                提醒频率
                                            </div>
                                            <Select
                                                placeholder="选择提醒频率"
                                                value={day}
                                                onChange={handleDay}
                                                style={{
                                                    width: '100%',
                                                    height: 40,
                                                    borderRadius: 4,
                                                    borderColor: '#ddd'
                                                }}
                                            >
                                                {dayOptions.map((option) => (
                                                    <Select.Option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </Modal>
                            </Col>
                            <Col span={16}></Col>
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
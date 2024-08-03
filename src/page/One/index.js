import {Table} from 'antd';
import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../store";

const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }
];
const Index = observer(() => {
    const { bookStore } = useStore();
    return <><Table columns={columns} dataSource={bookStore.books} /></>;
});
export default Index;
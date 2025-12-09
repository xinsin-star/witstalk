import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Form,
    Modal,
    Space,
} from 'antd';
import { type ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import { request } from '~/util/request';
import { useRequest } from '~/hook/useRequest.ts';
import { showMessage } from '~/util/msg';
import WtDrawer from '~/components/WtDrawer';
import WtPagination from '~/components/WtPagination';
import RoleMenu from './roleMenu';
import RoleUser from './roleUser';

const url = {
    list: '/system/sysRole/list',
    add: '/system/sysRole/add',
    detail: '/system/sysRole/detail',
    delete: '/system/sysRole/delete',
    edit: '/system/sysRole/update'
};

interface Role {
    id: number;
    roleName: string;
    roleKey: string;
    roleDesc: string;
    roleImg: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
}

export default function Role() {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState('新增角色');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [dataSource, setDataSource] = useState<Role[]>([]);
    const [operationType, setOperationType] = useState<'add' | 'edit' | 'view'>('add');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // 角色菜单绑定相关状态
    const [menuBindingVisible, setMenuBindingVisible] = useState(false);
    const [userBindingVisible, setUserBindingVisible] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
    const [selectedRoleName, setSelectedRoleName] = useState<string>('');

    // 获取角色列表数据
    const { data, mutate } = useRequest({
        url: url.list,
        method: 'POST',
        data: {
            pageNumber: page,
            pageSize: pageSize,
            roleName: searchText
        }
    });

    useEffect(() => {
        if (data) {
            setDataSource(data.records || []);
            setTotal(data.total || 0);
        }
    }, [data]);

    // 处理搜索
    const handleSearch = () => {
        setPage(1);
        setLoading(true);
        mutate().finally(() => {
            setLoading(false);
        });
    };

    // 处理重置
    const handleReset = () => {
        setSearchText('');
        setPage(1);
        setLoading(true);
        mutate().finally(() => {
            setLoading(false);
        });
    };

    // 处理新增
    const handleAdd = () => {
        setOperationType('add');
        setDrawerTitle('新增角色');
        setCurrentRecord(null);
        form.resetFields();
        setDrawerVisible(true);
    };

    // 处理编辑
    const handleEdit = (record: any) => {
        setOperationType('edit');
        setDrawerTitle('编辑角色');
        setCurrentRecord(record);
        form.setFieldsValue(record);
        setDrawerVisible(true);
    };

    // 处理查看
    const handleView = (record: any) => {
        setOperationType('view');
        setDrawerTitle('查看角色');
        setCurrentRecord(record);
        form.setFieldsValue(record);
        setDrawerVisible(true);
    };

    // 处理删除
    const handleDelete = (record: any) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除角色【${record.roleName}】吗？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    setLoading(true);
                    await request({
                        url: url.delete,
                        method: 'POST',
                        params: {
                            id: record.id
                        }
                    });
                    showMessage.success('删除成功');
                    mutate();
                } catch {
                    showMessage.error('删除失败');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // 处理表单提交
    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            const values = await form.validateFields();
            if (currentRecord) {
                // 编辑
                await request({
                    url: url.edit,
                    method: 'POST',
                    data: {
                        ...values,
                        id: currentRecord.id
                    }
                });
                showMessage.success('编辑成功');
            } else {
                // 新增
                await request({
                    url: url.add,
                    method: 'POST',
                    data: values
                });
                showMessage.success('新增成功');
            }
            setDrawerVisible(false);
            mutate();
        } catch {
            showMessage.error('操作失败');
        } finally {
            setSubmitLoading(false);
        }
    };

    // 处理分页变化
    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page);
        setPageSize(pageSize);
    };

    // 打开角色菜单绑定抽屉
    const handleOpenMenuBinding = (record: any) => {
        setSelectedRoleId(record.id);
        setSelectedRoleName(record.roleName);
        setMenuBindingVisible(true);
    };

    // 关闭角色菜单绑定抽屉
    const handleCloseMenuBinding = () => {
        setMenuBindingVisible(false);
    };

    // 处理角色菜单绑定保存成功
    const handleMenuBindingSaveSuccess = () => {
        showMessage.success('角色菜单绑定保存成功');
        setMenuBindingVisible(false);
    };

    // 打开角色用户绑定抽屉
    const handleOpenUserBinding = (record: any) => {
        setSelectedRoleId(record.id);
        setSelectedRoleName(record.roleName);
        setUserBindingVisible(true);
    };

    // 关闭角色用户绑定抽屉
    const handleCloseUserBinding = () => {
        setUserBindingVisible(false);
    };

    // 处理角色用户绑定保存成功
    const handleUserBindingSaveSuccess = () => {
        showMessage.success('角色用户绑定保存成功');
        setUserBindingVisible(false);
    };

    const columns: ColumnsType = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 50,
            render: (_: string, __: any, index: number) => index + 1,
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            align: 'center',
        },
        {
            title: '角色标识',
            dataIndex: 'roleKey',
            key: 'roleKey',
            align: 'center',
        },
        {
            title: '角色描述',
            dataIndex: 'roleDesc',
            key: 'roleDesc',
            align: 'center',
        },
        {
            title: '角色图片',
            dataIndex: 'roleImg',
            key: 'roleImg',
            align: 'center',
            render: (text: string) => text || '-',
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            key: 'createBy',
            align: 'center',
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
            width: 200,
        },
        {
            title: '修改人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            align: 'center',
            width: 100,
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            align: 'center',
            width: 200,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'end',
            width: 250,
            align: 'center',
            render: (_: unknown, record: any) => (
                <Space size="middle">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                    <Button type="link" icon={<SettingOutlined />} onClick={() => handleOpenMenuBinding(record)} />
                    <Button type="link" icon={<UserOutlined />} onClick={() => handleOpenUserBinding(record)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">角色管理</h3>
                <Button type="primary" className='cream-button' icon={<PlusOutlined />} onClick={handleAdd}>
                    新增角色
                </Button>
            </div>

            {/* 搜索区域 */}
            <div className="flex mb-4 gap-2">
                <Input
                    placeholder="请输入角色名称"
                    value={searchText}
                    className='cream-input'
                    onChange={(e) => setSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />
                <Button type="primary" className='cream-button' onClick={handleSearch}>
                    搜索
                </Button>
                <Button className='cream-button' onClick={handleReset}>
                    重置
                </Button>
            </div>

            {/* 表格区域 */}
            <Table
                bordered
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={false}
                loading={loading}
            />

            {/* 分页区域 */}
            <WtPagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                className="mt-4"
            />

            {/* 新增/编辑/查看抽屉 */}
            <WtDrawer
                title={drawerTitle}
                open={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onOk={operationType !== 'view' ? form.submit : undefined}
                okButtonProps={{ className: 'cream-button', loading: submitLoading }}
                cancelButtonProps={{ className: 'cream-button' }}
                confirmLoading={submitLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={operationType === 'view'}
                >
                    <Form.Item
                        name="roleName"
                        label="角色名称"
                        rules={[{ required: true, message: '请输入角色名称' }]}
                    >
                        <Input placeholder="请输入角色名称" className="cream-input" />
                    </Form.Item>

                    <Form.Item
                        name="roleKey"
                        label="角色标识"
                        rules={[{ required: true, message: '请输入角色标识' }]}
                    >
                        <Input placeholder="请输入角色标识" className="cream-input" />
                    </Form.Item>

                    <Form.Item
                        name="roleDesc"
                        label="角色描述"
                        rules={[{ required: true, message: '请输入角色描述' }]}
                    >
                        <Input.TextArea placeholder="请输入角色描述" className="cream-input" rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="roleImg"
                        label="角色图片"
                    >
                        <Input placeholder="请输入角色图片URL" className="cream-input" />
                    </Form.Item>
                </Form>
            </WtDrawer>

            {/* 角色菜单绑定抽屉 */}
            <WtDrawer
                title="角色菜单绑定"
                open={menuBindingVisible}
                onClose={handleCloseMenuBinding}
                width={600}
                footer={null}
            >
                <RoleMenu
                    roleId={selectedRoleId}
                    roleName={selectedRoleName}
                    visible={menuBindingVisible}
                    onClose={handleCloseMenuBinding}
                    onSaveSuccess={handleMenuBindingSaveSuccess}
                />
            </WtDrawer>

            {/* 角色用户绑定抽屉 */}
            <WtDrawer
                title="角色用户绑定"
                open={userBindingVisible}
                onClose={handleCloseUserBinding}
                width={600}
                footer={null}
            >
                <RoleUser
                    roleId={selectedRoleId}
                    roleName={selectedRoleName}
                    visible={userBindingVisible}
                    onClose={handleCloseUserBinding}
                    onSaveSuccess={handleUserBindingSaveSuccess}
                />
            </WtDrawer>
        </div>
    );
}

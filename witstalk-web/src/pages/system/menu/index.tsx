
import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Form,
    Modal,
    Space,
    Select
} from 'antd';
import { type ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { requestSWR, request } from '~/util/request';
import { showMessage } from '~/util/msg';
import WtDrawer from '~/components/WtDrawer';
import WtPagination from '~/components/WtPagination';

const { Option } = Select;

const url = {
    list: '/system/sysMenu/list',
    add: '/system/sysMenu/add',
    detail: '/system/sysMenu/detail',
    delete: '/system/sysMenu/remove',
    edit: '/system/sysMenu/update'
}

interface Menu {
    id: number;
    parentId: number;
    menuName: string;
    menuPath: string;
    perms: string;
    menuType: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    children?: Menu[];
}

export default function Menu() {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState('新增菜单');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [dataSource, setDataSource] = useState<Menu[]>([]);
    const [operationType, setOperationType] = useState<'add' | 'edit' | 'view'>('add');
    const [parentMenuOptions, setParentMenuOptions] = useState<{ value: number; label: string }[]>([]);
    const [, setMenuTree] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // 初始化菜单树选项
    const generateMenuTree = (menus: Menu[]) => {
        // 创建全新的菜单副本，避免引用共享
        const menuCopies = menus.map(menu => ({ ...menu, children: [] }));
        
        // 构建菜单映射
        const menuMap = new Map<number, Menu>();
        menuCopies.forEach(menu => {
            menuMap.set(menu.id, menu);
        });

        // 构建顶级菜单列表
        const rootMenus: Menu[] = [];
        menuCopies.forEach(menu => {
            if (menu.parentId === 0) {
                rootMenus.push(menu);
            }
        });

        // 为每个菜单添加子菜单
        menuCopies.forEach(menu => {
            if (menu.parentId !== 0) {
                const parent = menuMap.get(menu.parentId);
                if (parent && parent.children) {
                    // 直接添加子菜单，因为menuCopies是唯一的
                    parent.children.push(menu);
                }
            }
        });

        // 生成TreeSelect选项
        const generateOptions = (nodes: Menu[], prefix = '') => {
            const options: { value: number; label: string }[] = [];
            nodes.forEach(node => {
                const label = prefix + node.menuName;
                options.push({ value: node.id, label });
                if (node.children && node.children.length > 0) {
                    options.push(...generateOptions(node.children, label + ' / '));
                }
            });
            return options;
        };

        // 生成最终的树形结构
        const finalTree = [...rootMenus];
        
        setMenuTree(finalTree);
        setParentMenuOptions([{ value: 0, label: '顶级菜单' }, ...generateOptions(finalTree)]);
        // 直接设置新的数据源，确保React重新渲染
        setDataSource(finalTree);
    };

    // 获取菜单列表数据
    const { data, mutate } = requestSWR({
        url: url.list,
        method: 'POST',
        data: {
            pageNumber: page,
            pageSize: pageSize,
            menuName: searchText
        }
    });

    useEffect(() => {
        if (data) {
            setTotal(data.total || 0);
            // 构建完整的菜单树结构
            generateMenuTree(data.records || []);
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
        setDrawerTitle('新增菜单');
        setCurrentRecord(null);
        form.resetFields();
        form.setFieldsValue({ parentId: 0, menuType: 'M' });
        setDrawerVisible(true);
    };

    // 处理编辑
    const handleEdit = (record: any) => {
        setOperationType('edit');
        setDrawerTitle('编辑菜单');
        setCurrentRecord(record);
        form.setFieldsValue(record);
        setDrawerVisible(true);
    };

    // 处理查看
    const handleView = (record: any) => {
        setOperationType('view');
        setDrawerTitle('查看菜单');
        setCurrentRecord(record);
        form.setFieldsValue(record);
        setDrawerVisible(true);
    };

    // 收集当前节点及其所有子节点的id
    const collectMenuIds = (menu: Menu): number[] => {
        const ids: number[] = [menu.id];
        if (menu.children && menu.children.length > 0) {
            menu.children.forEach(child => {
                ids.push(...collectMenuIds(child));
            });
        }
        return ids;
    };

    // 处理删除
    const handleDelete = (record: any) => {
        // 收集所有要删除的节点id
        const deleteIds = collectMenuIds(record);
        const deleteCount = deleteIds.length;
        
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除菜单【${record.menuName}】及其${deleteCount - 1}个子菜单吗？`,
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
                            ids: deleteIds.join(',')
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

    const columns: ColumnsType = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 100,
            render: (_: string, __: any, index: number) => index + 1,
        },
        {
            title: '菜单名称',
            dataIndex: 'menuName',
            key: 'menuName',
            align: 'center',
            render: (text: string, record: any) => {
                const prefix = record.menuType === 'M' ? '菜单：' : '按钮：';
                return `${prefix}${text}`;
            }
        },
        {
            title: '菜单路径',
            dataIndex: 'menuPath',
            key: 'menuPath',
            align: 'center',
        },
        {
            title: '权限标识',
            dataIndex: 'perms',
            key: 'perms',
            align: 'center',
        },
        {
            title: '菜单类型',
            dataIndex: 'menuType',
            key: 'menuType',
            align: 'center',
            render: (text: string) => {
                return text === 'M' ? '菜单' : '按钮权限';
            }
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
            width: 150,
            align: 'center',
            render: (_: unknown, record: any) => (
                <Space size="middle">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">菜单管理</h3>
                <Button type="primary" className='cream-button' icon={<PlusOutlined />} onClick={handleAdd}>
                    新增菜单
                </Button>
            </div>

            {/* 搜索区域 */}
            <div className="flex mb-4 gap-2">
                <Input
                    placeholder="请输入菜单名称"
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
                        name="parentId"
                        label="父菜单"
                        rules={[{ required: true, message: '请选择父菜单' }]}
                    >
                        <Select placeholder="请选择父菜单" className="cream-input">
                            {parentMenuOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="menuName"
                        label="菜单名称"
                        rules={[{ required: true, message: '请输入菜单名称' }]}
                    >
                        <Input placeholder="请输入菜单名称" className="cream-input" />
                    </Form.Item>

                    <Form.Item
                        name="menuPath"
                        label="菜单路径"
                        rules={[{ required: true, message: '请输入菜单路径' }]}
                    >
                        <Input placeholder="请输入菜单路径" className="cream-input" />
                    </Form.Item>

                    <Form.Item
                        name="perms"
                        label="权限标识"
                        rules={[{ required: true, message: '请输入权限标识' }]}
                    >
                        <Input placeholder="请输入权限标识" className="cream-input" />
                    </Form.Item>

                    <Form.Item
                        name="menuType"
                        label="菜单类型"
                        rules={[{ required: true, message: '请选择菜单类型' }]}
                    >
                        <Select placeholder="请选择菜单类型" className="cream-input">
                            <Option value="M">菜单</Option>
                            <Option value="A">按钮权限</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </WtDrawer>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { request } from "~/util/request.ts";
import { useRequest } from "~/hook/useRequest.ts";
import { ConfigProvider, Form, Input, Tree, Avatar, Modal, Tooltip } from "antd";
import { PlusSquareOutlined, DeleteOutlined } from "@ant-design/icons";
import WtDrawer from "~/components/WtDrawer";
import { showMessage } from "~/util/msg.tsx";
import type { NamePath } from "antd/es/form/interface";
import defaultAvatar from '~/assets/images/defaultAvatar.svg';

const { Search } = Input;

export interface Channel {
    id: number; // 频道ID
    parentId: number; // 父频道ID
    channelName: string; // 频道名称 必选字段
    channelCode: string; // 频道编码 必选字段
    channelDesc: string; // 频道描述 可选字段
    channelTip: string; // 频道提示 可选字段
    channelImg: string; // 频道图片 可选字段 图片URL
    sort: number; // 排序字段 可选字段 数值越小越靠前
    isTop: boolean; // 是否置顶 可选字段 默认为false 需手动改为true才能置顶
    children?: Channel[];
}

const url: Record<string, string> = {
    list: '/system/sysChannel/treeList',
    treeListByUser: '/system/sysChannel/treeListByUser',
    add: '/system/sysChannel/add',
    delete: '/system/sysChannel/remove'
};

interface ChannelTreeProps {
    onSelect?: (channel: Channel) => void;
    isEdit?: boolean;
}

export default function ChannelTree(props: ChannelTreeProps) {
    const { onSelect, isEdit = false } = props;
    const [dataSource, setDataSource] = useState<Channel[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const { data, mutate } = useRequest({
        url: isEdit ? url.list : url.treeListByUser,
        method: 'POST',
        data: {}
    });

    // 收集所有节点ID用于默认展开
    const collectAllKeys = (channels: Channel[]): React.Key[] => {
        const keys: React.Key[] = [];

        const traverse = (nodes: Channel[]) => {
            nodes.forEach(node => {
                keys.push(node.id);
                if (node.children && node.children.length > 0) {
                    traverse(node.children);
                }
            });
        };

        traverse(channels);
        return keys;
    };

    useEffect(() => {
        if (data) {
            setDataSource(data);
            // 仅在第一次加载数据时设置全部展开
            if (isFirstLoad) {
                const allKeys = collectAllKeys(data);
                setExpandedKeys(allKeys);
                setIsFirstLoad(false);
            }
        }
    }, [data, isFirstLoad]);

    // 处理新增
    const handleAdd = (id: number) => {
        form.resetFields();
        form.setFieldValue("parentId" as NamePath, id);
        setDrawerVisible(true);
    };

    // 收集当前节点及其所有子节点的ID
    const collectAllNodeIds = (nodeId: number): number[] => {
        const allIds: number[] = [nodeId];

        const findChildren = (channels: Channel[], parentId: number) => {
            channels.forEach(channel => {
                if (channel.parentId === parentId) {
                    allIds.push(channel.id);
                    if (channel.children && channel.children.length > 0) {
                        findChildren(channel.children, channel.id);
                    }
                }
            });
        };

        findChildren(dataSource, nodeId);
        return allIds;
    };

    // 处理删除
    const handleDelete = (id: number) => {
        // 收集所有要删除的节点ID
        const allNodeIds = collectAllNodeIds(id);

        Modal.confirm({
                title: '确认删除',
                content: `确定要删除该频道及其所有子频道吗？共 ${allNodeIds.length} 个频道将被删除。`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: async () => {
                    try {
                        await request({
                            url: url.delete,
                            method: 'POST',
                            params: {
                                ids: allNodeIds.join(',')
                            }
                        });
                        showMessage.success('删除成功');
                        await mutate();
                    } catch (error) {
                        showMessage.error('删除失败');
                    }
                }
            });
    };

    // 自定义节点渲染
    const titleRender = (nodeData: Channel) => {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%"
            }}>
                {/* 频道图标展示 */}
                <Avatar
                    src={nodeData.channelImg ? `data:image/jpeg;base64,${nodeData.channelImg}` : defaultAvatar}
                    size={24}
                    shape="square"
                    style={{ cursor: 'pointer' }}
                    alt={nodeData.channelName}
                />
                <Tooltip title={nodeData.channelName} placement="top">
                    <span
                        style={{
                            color: "var(--cream-primary)",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            width: "100px"
                        }}
                    >
                        {nodeData.channelName}
                    </span>
                </Tooltip>
                { isEdit &&
                <PlusSquareOutlined
                    onClick={() => handleAdd(nodeData.id)}
                    style={{ color: "var(--cream-primary)", cursor: 'pointer' }}
                    title="新增子频道"
                />
                }
                { isEdit &&
                <DeleteOutlined
                    onClick={() => handleDelete(nodeData.id)}
                    style={{ color: "var(--cream-primary)", cursor: 'pointer' }}
                    title="删除频道"
                />
                }
            </div>
        );
    };

    // 表单新增回调
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // 新增
            const addRes = await request({
                url: url.add,
                method: 'POST',
                data: values
            });
            if (addRes) {
                showMessage.success('新增成功');
                setDrawerVisible(false);
                await mutate();
            } else {
                showMessage.warning('新增失败');
            }
        } catch (error) {
            showMessage.error('操作失败');
        }
    };

    const treeSelect = (_selectedKeys: any, e: { selected: boolean, selectedNodes: any[], node: any, event: any }) => {
        if (onSelect && e.selectedNodes.length > 0) {
            onSelect(e.selectedNodes[0] as Channel)
        }
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: "var(--cream-bg-2)",
                },
            }}
        >
            <div style={{ height: "84vh", width: "20vw", margin: "10px", overflow: "auto" }}>
                <Search style={{ marginBottom: 8 }} placeholder="Search" />
                <Tree
                    onSelect={treeSelect}
                    treeData={dataSource as any}
                    expandedKeys={expandedKeys}
                    onExpand={newExpandedKeys => setExpandedKeys(newExpandedKeys)}
                    autoExpandParent={true}
                    fieldNames={{ title: "channelName", key: "id", children: "children" }}
                    titleRender={titleRender as any}
                    style={{ width: '100%', minWidth: '300px' }}
                    showLine={true}
                />

                <WtDrawer
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    title="新增频道"
                    onOk={form.submit}
                    okButtonProps={{ className: 'cream-button' }}
                    cancelButtonProps={{ className: 'cream-button' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="channelName"
                            label="频道名称"
                            rules={[{ required: true, message: '请输入频道名称' }]}
                        >
                            <Input
                                maxLength={20}
                                className='cream-input'
                                placeholder="请输入频道名称"
                            />
                        </Form.Item>
                        <Form.Item
                            hidden
                            name="parentId"
                            label="父级id"
                        />
                    </Form>
                </WtDrawer>
            </div>
        </ConfigProvider>
    );
}

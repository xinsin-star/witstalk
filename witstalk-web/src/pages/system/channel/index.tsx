import { Empty, Form, Input, InputNumber, Switch, Button, Row, Col } from "antd";
import DictType from "~/components/DictType";
import { useState } from "react";
import ChannelTree from "~/components/ChannelTree";
import { request } from "~/util/request";
import { showMessage } from "~/util/msg";

import { useDictType } from "~/hook/useDictType";

// Define Channel interface locally
type Channel = {
    id: number;
    parentId: number;
    channelName: string;
    channelCode: string;
    channelDesc: string;
    channelTip: string;
    channelImg: string;
    sort: number;
    isTop: boolean;
    children?: Channel[];
};

const url = {
    detail: '/system/sysChannel/detail',
    create: '/system/sysChannel/update',
    delete: '/system/sysChannel/delete'
}

// Keep the ChannelForm interface with annotations
interface ChannelForm extends Channel {
    channelType: string; //必填字段 频道类型字典项value sys_channel_type 这是字典type
    channelTypeText: string; //必填字段 频道类型字典项label sys_channel_type
    maxLength: number; //必填字段 最大可进入人数
    permissionId: number; //必填字段 权限ID 这块代码应从权限管理模块获取
    permissionCode: string; //必填字段 权限编码 这是字典code
    is_password: boolean; //必填字段 是否需要密码
    password: string; // 密码 只有当is_password为true时才需要填写
    is_visible: boolean; // 是否可见 默认为false 需要手动改为true才能在前端显示
    createTime: string; // 创建时间 不可修改
    updateTime: string; // 更新时间 不可修改
    createBy: string; // 创建人 不可修改
    updateBy: string; // 更新人 不可修改
}

export default function Channel() {
    const [form] = Form.useForm();
    const [treeData, setTreeData] = useState<Channel | null>(null);
    const { dictList } = useDictType('sys_channel_type');

    const detailForm = (id?: number) => {
        const targetId = id || treeData?.id;
        if (!targetId) return;
        
        request({
            url: url.detail,
            method: 'POST',
            params: {
                id: targetId
            }
        }).then(res => {
            form.setFieldsValue(res.data);
        })
    }

    const treeSelect = (nodeData: Channel) => {
        delete nodeData.children;
        setTreeData(nodeData);
        detailForm(nodeData.id);
    }

    const handleSubmit = async (values: ChannelForm) => {
        try {
            const channelTypeItem = dictList.find(item => item.dictValue === values.channelType);
            if (!channelTypeItem) {
                showMessage.error('频道类型不存在');
                return;
            }
            values.channelTypeText = channelTypeItem.dictLabel || '';
            form.setFieldsValue(values);
            await request({
                url: url.create,
                method: 'POST',
                params: {
                    ...values,
                    id: treeData?.id || 0
                }
            });
            showMessage.success('保存成功');
            detailForm(values.id);
        } catch (error) {
            showMessage.error('保存失败');
        }
    }

    return (
        <div style={{
            display: 'flex'
        }}>
            <div>
                <ChannelTree isEdit onSelect={treeSelect}/>
            </div>
            <div style={{
                height: '84vh',
                width: '78vw',
                margin: '10px',
                overflow: 'auto',
                backgroundColor: 'var(--cream-bg-2)',
                borderRadius: 'var(--cream-border-radius)',
                padding: 'var(--cream-padding-small-mobile)'
            }}>
                {
                    !treeData && (
                        <Empty
                            description="请选择一个频道"
                        />
                    )
                }
                {
                    treeData && (
                        <div style={{ padding: '20px' }}>
                            <h3 className="text-lg font-bold mb-4 cream-title">频道详情 - {treeData.channelName}</h3>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                className="cream-card cream-form"
                                style={{ borderRadius: 'var(--cream-border-radius)', maxWidth: '78vw' }}
                            >
                                {/* 提交按钮 */}
                                <div className="flex gap-3 pb-4 mb-8 border-b border-cream-input">
                                    <Button 
                                        htmlType="submit" 
                                        type="primary" 
                                        className="cream-button"
                                        size="large"
                                        style={{ 
                                            padding: '8px 24px',
                                            borderRadius: 'var(--cream-border-radius-small)'
                                        }}
                                    >
                                        保存
                                    </Button>
                                </div>
                                {/* 基本信息 */}
                                <div className="mb-8 cream-box">
                                    <h4 className="text-lg font-semibold mb-4 text-cream-primary border-b border-cream-input pb-2">基本信息</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="channelName"
                                                label="频道名称"
                                                rules={[{ required: true, message: '请输入频道名称' }]}
                                            >
                                                <Input placeholder="请输入频道名称" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="channelCode"
                                                label="频道编码"
                                                rules={[{ required: true, message: '请输入频道编码' }]}
                                            >
                                                <Input placeholder="请输入频道编码" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="channelType"
                                                label="频道类型"
                                                rules={[{ required: true, message: '请选择频道类型' }]}
                                            >
                                                {/* 使用字典通用选择器，字典类型为 sys_channel_type */}
                                                <DictType 
                                                    dictType="sys_channel_type" 
                                                    placeholder="请选择频道类型"
                                                    className="cream-input"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="channelTypeText"
                                                label="频道类型"
                                                hidden
                                            />
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="maxLength"
                                                label="最大可进入人数"
                                                rules={[{ required: true, message: '请输入最大可进入人数' }]}
                                            >
                                                <InputNumber min={1} placeholder="请输入最大可进入人数" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                
                                {/* 权限设置 */}
                                <div className="mb-8 cream-box">
                                    <h4 className="text-lg font-semibold mb-4 text-cream-primary border-b border-cream-input pb-2">权限设置</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="permissionId"
                                                label="权限ID"
                                                rules={[{ required: true, message: '请输入权限ID' }]}
                                            >
                                                <InputNumber min={1} placeholder="请输入权限ID" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="permissionCode"
                                                label="权限编码"
                                                rules={[{ required: true, message: '请输入权限编码' }]}
                                            >
                                                <Input placeholder="请输入权限编码" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                
                                {/* 密码设置 */}
                                <div className="mb-8 cream-box">
                                    <h4 className="text-lg font-semibold mb-4 text-cream-primary border-b border-cream-input pb-2">密码设置</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="is_password"
                                                label="是否需要密码"
                                                valuePropName="checked"
                                                initialValue={false}
                                            >
                                                <Switch style={{ backgroundColor: '#a67c41' }} />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="password"
                                                label="密码"
                                                rules={[
                                                    {
                                                        required: false,
                                                        validator: (_, value) => {
                                                            const isPasswordRequired = form.getFieldValue('is_password');
                                                            if (isPasswordRequired && !value) {
                                                                return Promise.reject(new Error('请输入密码'));
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <Input.Password placeholder="请输入密码" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                
                                {/* 其他设置 */}
                                <div className="mb-8 cream-box">
                                    <h4 className="text-lg font-semibold mb-4 text-cream-primary border-b border-cream-input pb-2">其他设置</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="is_visible"
                                                label="是否可见"
                                                valuePropName="checked"
                                                initialValue={false}
                                            >
                                                <Switch style={{ backgroundColor: '#a67c41' }} />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="isTop"
                                                label="是否置顶"
                                                valuePropName="checked"
                                                initialValue={false}
                                            >
                                                <Switch style={{ backgroundColor: '#a67c41' }} />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="sort"
                                                label="排序"
                                                rules={[{ required: true, message: '请输入排序值' }]}
                                            >
                                                <InputNumber min={0} placeholder="请输入排序值" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="channelImg"
                                                label="频道图片"
                                            >
                                                <Input placeholder="请输入频道图片URL" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                
                                {/* 描述信息 */}
                                <div className="mb-8 cream-box">
                                    <h4 className="text-lg font-semibold mb-4 text-cream-primary border-b border-cream-input pb-2">描述信息</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="channelDesc"
                                                label="频道描述"
                                            >
                                                <Input.TextArea rows={4} placeholder="请输入频道描述" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={24}>
                                            <Form.Item
                                                name="channelTip"
                                                label="频道提示"
                                            >
                                                <Input.TextArea rows={2} placeholder="请输入频道提示" className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                
                                {/* 不可修改字段 */}
                                <div className="mb-8 cream-box bg-cream-bg-1">
                                    <h4 className="text-lg font-semibold mb-4 text-cream-secondary border-b border-cream-input pb-2">系统信息</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="createTime"
                                                label="创建时间"
                                                rules={[]}
                                            >
                                                <Input disabled className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="updateTime"
                                                label="更新时间"
                                                rules={[]}
                                            >
                                                <Input disabled className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="createBy"
                                                label="创建人"
                                                rules={[]}
                                            >
                                                <Input disabled className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col span={12}>
                                            <Form.Item
                                                name="updateBy"
                                                label="更新人"
                                                rules={[]}
                                            >
                                                <Input disabled className="cream-input" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

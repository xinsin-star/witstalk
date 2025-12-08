import React, { useState, useEffect } from 'react';
import {
    Tree,
    Button,
    Spin
} from 'antd';
import {
    SaveOutlined
} from '@ant-design/icons';
import { request } from '~/util/request';
import { showMessage } from '~/util/msg';

interface MenuNode {
    id: number;
    title: string;
    key: string;
    children?: MenuNode[];
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

interface RoleMenuBindingProps {
    roleId: number;
    roleName: string;
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

const url = {
    // 菜单相关接口
    menuList: '/system/sysMenu/list',
    // 角色菜单绑定接口
    roleMenuList: '/system/sysRoleMenu/list',
    saveRoleMenu: '/system/sysRoleMenu/save'
};

const RoleMenu: React.FC<RoleMenuBindingProps> = ({
    roleId,
    roleName,
    visible,
    onClose,
    onSaveSuccess
}) => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [halfCheckedKeys, setHalfCheckedKeys] = useState<string[]>([]);
    const [menuTreeData, setMenuTreeData] = useState<MenuNode[]>([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [treeLoading, setTreeLoading] = useState(false);

    // 将扁平化菜单数据转换为层级结构
    const buildMenuTree = (menus: Menu[]): Menu[] => {
        const menuMap: Record<number, Menu> = {};
        const tree: Menu[] = [];
        
        // 构建菜单映射，确保每个菜单都有children数组
        menus.forEach(menu => {
            menuMap[menu.id] = { ...menu, children: [] };
        });
        
        // 构建树形结构
        menus.forEach(menu => {
            if (menu.parentId === 0) {
                // 顶级菜单直接添加到树中
                tree.push(menuMap[menu.id]);
            } else {
                // 子菜单添加到父菜单的children中
                const parent = menuMap[menu.parentId];
                if (parent && parent.children) {
                    parent.children.push(menuMap[menu.id]);
                }
            }
        });
        
        return tree;
    };

    // 将Menu数组转换为Tree组件所需的MenuNode数组
    const convertToTreeNodes = (menus: Menu[]): MenuNode[] => {
        return menus.map(menu => {
            const node: MenuNode = {
                id: menu.id,
                title: menu.menuName,
                key: menu.id.toString()
            };
            if (menu.children && menu.children.length > 0) {
                node.children = convertToTreeNodes(menu.children);
            }
            return node;
        });
    };

    // 获取菜单树数据
    const getMenuTree = async () => {
        try {
            setTreeLoading(true);
            const response = await request({
                url: url.menuList,
                method: 'POST',
                data: {
                    pageNumber: 1,
                    pageSize: 1000
                }
            });
            
            // 转换扁平化数据为层级结构
            const menus = response.data.records || [];
            const menuTree = buildMenuTree(menus);
            
            // 转换为Tree组件所需格式
            setMenuTreeData(convertToTreeNodes(menuTree));
        } catch {
            showMessage.error('获取菜单树失败');
        } finally {
            setTreeLoading(false);
        }
    };

    // 获取角色已绑定的菜单
    const getRoleMenus = async () => {
        try {
            setTreeLoading(true);
            const response = await request({
                url: url.roleMenuList,
                method: 'POST',
                data: {
                    roleId,
                    pageNumber: 1,
                    pageSize: 1000
                }
            });
            // 转换为Tree组件所需的key格式
            const menuIds = response.data.records.map((item: any) => item.menuId.toString());
            setCheckedKeys(menuIds);
        } catch {
            showMessage.error('获取角色菜单失败');
        } finally {
            setTreeLoading(false);
        }
    };

    // 组件挂载或角色id变化时获取数据
    useEffect(() => {
        if (visible) {
            // 并行获取菜单树和角色菜单数据
            Promise.all([
                getMenuTree(),
                getRoleMenus()
            ]);
        }
    }, [visible, roleId]);

    // 处理菜单选择变化
    const handleMenuSelect = (checked: any, info: any) => {
        // Extract checked and halfChecked keys from the checked parameter
        const checkedKeysValue = Array.isArray(checked) ? checked : (checked.checked || []);
        const halfCheckedKeysValue = Array.isArray(checked) ? info.halfCheckedKeys : (checked.halfChecked || []);
        
        setCheckedKeys(checkedKeysValue);
        setHalfCheckedKeys(halfCheckedKeysValue);
    };

    // 保存角色菜单绑定
    const handleSaveRoleMenu = async () => {
        try {
            setSaveLoading(true);
            // 构建保存数据
            const saveData = {
                roleId,
                menuIds: checkedKeys.map(key => parseInt(key))
            };

            await request({
                url: url.saveRoleMenu,
                method: 'POST',
                data: saveData
            });

            showMessage.success('保存成功');
            onSaveSuccess();
            onClose();
        } catch {
            showMessage.error('保存失败');
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h4 className="mb-4 font-semibold">{roleName} - 菜单权限</h4>
            
            <div className="bg-white p-4 rounded border mb-4 min-h-[300px]">
                {treeLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Tree
                        checkable
                        treeData={menuTreeData}
                        checkedKeys={{ checked: checkedKeys, halfChecked: halfCheckedKeys }}
                        onCheck={handleMenuSelect}
                        checkStrictly={false}
                        defaultExpandAll
                    />
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button onClick={onClose} className="cream-button">
                    取消
                </Button>
                <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveRoleMenu}
                    loading={saveLoading}
                    className="cream-button"
                >
                    保存
                </Button>
            </div>
        </div>
    );
};

export default RoleMenu;
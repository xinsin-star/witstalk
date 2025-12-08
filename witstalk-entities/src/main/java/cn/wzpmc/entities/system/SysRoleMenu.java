package cn.wzpmc.entities.system;

import com.mybatisflex.annotation.Column;
import com.mybatisflex.annotation.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.entity.BaseEntity;
import top.xinsin.listener.MyInsertListener;
import top.xinsin.listener.MyUpdateListener;

import java.util.List;

/**
 * 角色菜单实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_role_menu", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysRoleMenu extends BaseEntity {
    /**
     * 角色ID
     */
    private Long roleId;
    /**
     * 菜单ID
     */
    private Long menuId;

    @Column(ignore = true)
    private List<Long> menuIds;
}

package cn.wzpmc.entities.system;

import com.mybatisflex.annotation.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.entity.BaseEntity;
import top.xinsin.listener.MyInsertListener;
import top.xinsin.listener.MyUpdateListener;

/**
 * 菜单实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_menu", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysMenu extends BaseEntity {
    /**
     * 菜单名称
     */
    private String menuName;
    /**
     * 菜单路径
     */
    private String menuPath;
    /**
     * 菜单类型
     */
    private String menuType;
    /**
     * 权限标识
     */
    private String perms;
    /**
     * 父级id
     */
    private Long parentId;
}

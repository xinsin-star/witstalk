package cn.wzpmc.entities.system;

import com.mybatisflex.annotation.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.entity.BaseEntity;
import top.xinsin.listener.MyInsertListener;
import top.xinsin.listener.MyUpdateListener;

/**
 * 角色实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_role", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysRole extends BaseEntity {
    /**
     * 角色名称
     */
    private String roleName;
    /**
     * 角色key
     */
    private String roleKey;
    /**
     * 角色描述
     */
    private String roleDesc;
    /**
     * 角色图片地址
     */
    private String roleImg;
}

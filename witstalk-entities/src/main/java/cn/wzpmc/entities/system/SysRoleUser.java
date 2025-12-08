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
 * 角色用户实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_role_user", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysRoleUser extends BaseEntity {
    /**
     * 角色ID
     */
    private Long roleId;
    /**
     * 用户ID
     */
    private Long userId;

    @Column(ignore = true)
    private List<Long> userIds;
}

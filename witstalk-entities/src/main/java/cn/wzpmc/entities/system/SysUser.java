package cn.wzpmc.entities.system;

import com.mybatisflex.annotation.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.entity.BaseEntity;
import top.xinsin.listener.MyInsertListener;
import top.xinsin.listener.MyUpdateListener;

/**
 * 用户实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_user", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysUser extends BaseEntity {
    /**
     * 用户名
     */
    private String username;
    /**
     * 密码
     */
    private String password;
    /**
     * 昵称
     */
    private String nickName;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 头像
     */
    private String avatar;
}

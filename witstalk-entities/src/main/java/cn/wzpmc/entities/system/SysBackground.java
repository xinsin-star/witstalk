package cn.wzpmc.entities.system;

import com.mybatisflex.annotation.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.entity.BaseEntity;
import top.xinsin.listener.MyInsertListener;
import top.xinsin.listener.MyUpdateListener;

/**
 * 背景实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_background", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysBackground extends BaseEntity {
    /**
     * 用户id
     */
    private Long userId;
    /**
     * 图片地址
     */
    private String imgUrl;
    /**
     * 图片名称
     */
    private String imgName;
    /**
     * 类型
     */
    private String type;
    /**
     * 类型文本 轮换 固定
     */
    private String typeText;
    /**
     * 是否为主背景
     */
    private Boolean isMaster;
    /**
     * cron表达式
     */
    private String cron;
    /**
     * 排序
     */
    private Long sort;
}

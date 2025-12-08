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
 * 字典类型实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_dict_type", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysDictType extends BaseEntity {
    /**
     * 字典类型
     */
    private String dictType;
    /**
     * 字典名称
     */
    private String dictName;
    /**
     * 字典描述
     */
    private String dictDesc;

    @Column(ignore = true)
    private List<SysDictTypeItem> sysDictTypeItems;
}

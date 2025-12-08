package cn.wzpmc.entities.system;

import com.mybatisflex.annotation.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.entity.BaseEntity;
import top.xinsin.listener.MyInsertListener;
import top.xinsin.listener.MyUpdateListener;

/**
 * 字典类型项实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(value = "sys_dict_type_item", onInsert = MyInsertListener.class, onUpdate = MyUpdateListener.class)
public class SysDictTypeItem extends BaseEntity {
    /**
     * 字典类型ID
     */
    private Integer dictTypeId;
    /**
     * 字典名称
     */
    private String dictName;
    /**
     * 字典值
     */
    private String dictValue;
    /**
     * 排序
     */
    private Integer sort;

}

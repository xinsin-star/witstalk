package top.xinsin.service.impl;

import cn.wzpmc.entities.system.SysDictTypeItem;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import top.xinsin.mapper.SysDictTypeItemMapper;
import top.xinsin.service.ISysDictTypeItemService;
import top.xinsin.util.PageResult;

import static cn.wzpmc.entities.system.table.SysDictTypeItemTableDef.SYS_DICT_TYPE_ITEM;

@Service
public class SysDictTypeItemServiceImpl extends ServiceImpl<SysDictTypeItemMapper, SysDictTypeItem> implements ISysDictTypeItemService {
    public PageResult<SysDictTypeItem> customPage(SysDictTypeItem sysDictTypeItem, Page<SysDictTypeItem> page) {
        QueryWrapper queryWrapper = QueryWrapper.create(sysDictTypeItem).orderBy(SYS_DICT_TYPE_ITEM.SORT, true);
        Page<SysDictTypeItem> page1 = this.page(page, queryWrapper);
        return PageResult.page(page1.getPageNumber(), page1.getPageSize(), page1.getTotalRow(), page1.getRecords());
    }
}

package top.xinsin.service.impl;

import cn.wzpmc.entities.system.vo.SysChannelTreeVO;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import cn.wzpmc.entities.system.SysChannel;
import top.xinsin.mapper.SysChannelMapper;
import top.xinsin.service.ISysChannelService;
import top.xinsin.util.BeanRecordUtil;
import top.xinsin.util.PageResult;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SysChannelServiceImpl extends ServiceImpl<SysChannelMapper, SysChannel> implements ISysChannelService {
    public PageResult<SysChannel> customPage(SysChannel sysChannel, Page<SysChannel> page) {
        QueryWrapper queryWrapper = QueryWrapper.create(sysChannel);
        Page<SysChannel> page1 = this.page(page, queryWrapper);
        return PageResult.page(page1.getPageNumber(), page1.getPageSize(), page1.getTotalRow(), page1.getRecords());
    }

    public List<SysChannelTreeVO> getTreeList(SysChannel sysChannel) {
        QueryWrapper queryWrapper = QueryWrapper.create(sysChannel);
        List<SysChannel> list = this.list(queryWrapper);
//        树级结构的数据
        List<SysChannel> sysChannels = buildTree(list, 0L);
//        组合成vo返回
        return sysChannels.stream().map(item -> BeanRecordUtil.beanConvertRecord(item, SysChannelTreeVO.class)).toList();
    }

    /**
     * 构建树形结构
     * @param list 扁平化数据列表
     * @param parentId 根节点父ID（顶级频道为0）
     * @return 树形结构列表
     */
    private List<SysChannel> buildTree(List<SysChannel> list, Long parentId) {
        // 1. 将列表转为Map（key: 节点ID，value: 节点），便于快速查找
        Map<Long, SysChannel> nodeMap = list.stream()
                .collect(Collectors.toMap(SysChannel::getId, node -> node));

        // 2. 遍历所有节点，为每个节点设置子节点
        List<SysChannel> treeList = new ArrayList<>();
        for (SysChannel node : list) {
            Long currentParentId = node.getParentId();
            // 如果是顶级节点，加入根列表
            if (currentParentId.equals(parentId)) {
                treeList.add(node);
            } else {
                // 不是顶级节点，找到父节点并添加为子节点
                SysChannel parentNode = nodeMap.get(currentParentId);
                if (parentNode != null) {
                    if (parentNode.getChildren() == null) {
                        parentNode.setChildren(new ArrayList<>());
                    }
                    parentNode.getChildren().add(node);
                }
            }
        }

        // 3. 对每个节点的子节点进行排序（先按置顶、再按排序值）
        sortTreeChildren(treeList);

        return treeList;
    }
    private void sortTreeChildren(List<SysChannel> nodeList) {
        if (nodeList == null || nodeList.isEmpty()) {
            return;
        }

        // 排序规则：isTop降序（置顶优先） -> sort降序（排序值大的优先） -> id升序（兜底）
        nodeList.sort(Comparator.comparing(SysChannel::getIsTop, Comparator.reverseOrder())
                .thenComparing(SysChannel::getSort, Comparator.reverseOrder())
                .thenComparing(SysChannel::getId));

        // 递归排序子节点
        for (SysChannel node : nodeList) {
            sortTreeChildren(node.getChildren());
        }
    }
}

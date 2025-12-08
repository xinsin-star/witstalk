package cn.wzpmc.entities.system.vo;

import java.util.List;

public record SysChannelTreeVO(
        Long id,
        Long parentId,
        String channelName,
        String channelCode,
        String channelDesc,
        String channelTip,
        String channelImg,
        Long sort,
        Boolean isTop,
        List<SysChannelTreeVO> children
) {}

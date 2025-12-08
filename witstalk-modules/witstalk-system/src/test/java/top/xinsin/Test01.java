package top.xinsin;

import cn.wzpmc.entities.system.SysChannel;
import cn.wzpmc.entities.system.vo.SysChannelTreeVO;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.Test;
import top.xinsin.util.BeanRecordUtil;

import java.util.ArrayList;

public class Test01 {
    @Test
    public void test01() {
        SysChannel sysChannel = new SysChannel();
        sysChannel.setId(1L);
        sysChannel.setChannelCode("code001");
        sysChannel.setChannelDesc("desc001");
        sysChannel.setChannelName("name001");
        sysChannel.setChannelType("type001");
        sysChannel.setParentId(1L);
        sysChannel.setChannelTip("tip001");
        sysChannel.setChannelImg("img001");
        sysChannel.setSort(1L);
        sysChannel.setIsTop(true);
        sysChannel.setIsPassword(true);
        ArrayList<SysChannel> sysChannels = getSysChannels();
        sysChannel.setChildren(sysChannels);


        SysChannelTreeVO sysChannelTreeVO = BeanRecordUtil.beanConvertRecord(sysChannel, SysChannelTreeVO.class);
        System.out.println(sysChannelTreeVO);
    }

    @NotNull
    private static ArrayList<SysChannel> getSysChannels() {
        ArrayList<SysChannel> sysChannels = new ArrayList<>();
        SysChannel sysChannel1 = new SysChannel();
        sysChannel1.setId(2L);
        sysChannel1.setChannelCode("code002");
        sysChannel1.setChannelDesc("desc002");
        sysChannel1.setChannelName("name002");
        sysChannel1.setChannelType("type002");
        sysChannel1.setParentId(2L);
        sysChannel1.setChannelTip("tip002");
        sysChannel1.setChannelImg("img002");
        sysChannel1.setSort(1L);
        sysChannel1.setIsTop(true);
        sysChannel1.setIsPassword(true);
        sysChannels.add(sysChannel1);
        ArrayList<SysChannel> sysChannels1 = getChannels();
        sysChannel1.setChildren(sysChannels1);
        return sysChannels;
    }

    @NotNull
    private static ArrayList<SysChannel> getChannels() {
        ArrayList<SysChannel> sysChannels1 = new ArrayList<>();
        SysChannel sysChannel2 = new SysChannel();
        sysChannel2.setId(3L);
        sysChannel2.setChannelCode("code003");
        sysChannel2.setChannelDesc("desc003");
        sysChannel2.setChannelName("name003");
        sysChannel2.setChannelType("type003");
        sysChannel2.setParentId(3L);
        sysChannel2.setChannelTip("tip003");
        sysChannel2.setChannelImg("img003");
        sysChannel2.setSort(3L);
        sysChannel2.setIsTop(true);
        sysChannel2.setIsPassword(true);
        sysChannels1.add(sysChannel2);
        return sysChannels1;
    }
}

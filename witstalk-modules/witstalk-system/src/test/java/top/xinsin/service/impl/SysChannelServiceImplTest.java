package top.xinsin.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import cn.wzpmc.entities.system.SysChannel;
import top.xinsin.mapper.SysChannelMapper;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class SysChannelServiceImplTest {

    @Mock
    private SysChannelMapper sysChannelMapper;

    @InjectMocks
    private SysChannelServiceImpl sysChannelService;

    @Test
    void testServiceNotNull() {
        // 简单测试服务是否能被正确注入
        assertNotNull(sysChannelService);
    }
}
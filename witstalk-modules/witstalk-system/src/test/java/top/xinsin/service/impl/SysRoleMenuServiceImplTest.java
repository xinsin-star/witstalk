package top.xinsin.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import cn.wzpmc.entities.system.SysRoleMenu;
import top.xinsin.mapper.SysRoleMenuMapper;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class SysRoleMenuServiceImplTest {

    @Mock
    private SysRoleMenuMapper sysRoleMenuMapper;

    @InjectMocks
    private SysRoleMenuServiceImpl sysRoleMenuService;

    @Test
    void testServiceNotNull() {
        // 简单测试服务是否能被正确注入
        assertNotNull(sysRoleMenuService);
    }
}
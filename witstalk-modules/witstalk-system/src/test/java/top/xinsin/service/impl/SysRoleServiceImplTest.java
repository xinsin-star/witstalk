package top.xinsin.service.impl;

import cn.wzpmc.entities.system.SysRole;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import top.xinsin.mapper.SysRoleMapper;
import top.xinsin.util.PageResult;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SysRoleServiceImplTest {

    @Mock
    private SysRoleMapper sysRoleMapper;

    @InjectMocks
    private SysRoleServiceImpl sysRoleService;

    private SysRole testRole;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        testRole = new SysRole();
        testRole.setId(1L);
        testRole.setRoleName("Admin");
        testRole.setRoleKey("admin");
        testRole.setRoleDesc("Administrator role");
    }

    @Test
    void testServiceNotNull() {
        // 简单测试，确保服务实例不为空
        assertNotNull(sysRoleService);
    }
}

package top.xinsin.service.impl;

import cn.wzpmc.entities.system.SysUser;
import cn.wzpmc.entities.system.vo.SysUserAndAuthVO;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import top.xinsin.mapper.SysUserMapper;
import top.xinsin.util.PageResult;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SysUserServiceImplTest {

    @Mock
    private SysUserMapper sysUserMapper;

    @InjectMocks
    private SysUserServiceImpl sysUserService;

    private SysUser testUser;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        testUser = new SysUser();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setNickName("Test User");
    }

    @Test
    void testServiceNotNull() {
        // 简单测试，确保服务实例不为空
        assertNotNull(sysUserService);
    }
}

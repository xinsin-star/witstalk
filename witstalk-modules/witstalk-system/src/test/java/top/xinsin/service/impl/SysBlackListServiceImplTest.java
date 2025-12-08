package top.xinsin.service.impl;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import cn.wzpmc.entities.system.SysBlackList;
import top.xinsin.mapper.SysBlackListMapper;
import top.xinsin.util.PageResult;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class SysBlackListServiceImplTest {

    @Mock
    private SysBlackListMapper sysBlackListMapper;

    @InjectMocks
    private SysBlackListServiceImpl sysBlackListService;

    @Test
    void testServiceNotNull() {
        // 简单测试服务是否能被正确注入
        assertNotNull(sysBlackListService);
    }
}
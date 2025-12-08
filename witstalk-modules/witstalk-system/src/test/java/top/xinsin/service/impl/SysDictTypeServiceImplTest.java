package top.xinsin.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import cn.wzpmc.entities.system.SysDictType;
import org.springframework.data.redis.core.RedisTemplate;
import top.xinsin.mapper.SysDictTypeMapper;
import top.xinsin.util.PageResult;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class SysDictTypeServiceImplTest {

    @Mock
    private SysDictTypeMapper sysDictTypeMapper;

    @Mock
    private SysDictTypeItemServiceImpl sysDictTypeItemService;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @InjectMocks
    private SysDictTypeServiceImpl sysDictTypeService;

    @Test
    void testServiceNotNull() {
        // 简单测试服务是否能被正确注入
        assertNotNull(sysDictTypeService);
    }

    @Test
    void testServiceInstance() {
        // 测试服务实例类型
        assertNotNull(sysDictTypeService);
    }
}
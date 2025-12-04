package top.xinsin.api.system.factory;

import cn.wzpmc.entities.system.SysUser;
import cn.wzpmc.entities.system.vo.SysUserAndAuthVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import top.xinsin.api.system.RemoteUserService;
import top.xinsin.util.Result;


@Slf4j
public class RemoteUserFallbackFactory implements FallbackFactory<RemoteUserService> {
    @Override
    public RemoteUserService create(Throwable cause) {
        return new RemoteUserService() {
            @Override
            public Result<SysUserAndAuthVO> getUserInfo(String username) {
                log.error("RemoteUserService getUserInfo fallback: {}", cause.getMessage());
                return Result.fail("RemoteUserService getUserInfo fallback: " + cause.getMessage());
            }

            @Override
            public Result<SysUser> register(String username, String nickName, String password) {
                log.error("RemoteUserService register fallback: {}", cause.getMessage());
                return Result.fail("RemoteUserService register fallback: " + cause.getMessage());
            }
        };
    }
}

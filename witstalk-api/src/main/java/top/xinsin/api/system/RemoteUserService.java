package top.xinsin.api.system;

import cn.wzpmc.entities.system.SysUser;
import cn.wzpmc.entities.system.vo.SysUserAndAuthVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import top.xinsin.api.ServiceNameConstant;
import top.xinsin.api.system.factory.RemoteUserFallbackFactory;
import top.xinsin.util.Result;

@FeignClient(contextId = "remoteUserService", value = ServiceNameConstant.WITSTALK_SYSTEM, fallbackFactory = RemoteUserFallbackFactory.class)
public interface RemoteUserService {
    @GetMapping("/sysUser/getUserInfo")
    Result<SysUserAndAuthVO> getUserInfo(@RequestParam("username") String username);

    @GetMapping("/sysUser/register")
    Result<SysUser> register(@RequestParam("username") String username, @RequestParam("nickName") String nickName, @RequestParam("password") String password);
}

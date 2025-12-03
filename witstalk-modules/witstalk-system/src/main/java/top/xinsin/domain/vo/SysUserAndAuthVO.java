package top.xinsin.domain.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import top.xinsin.domain.SysUser;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class SysUserAndAuthVO extends SysUser {
    private List<String> roles;
    private List<String> perms;

    private String roleKeyArray;
    private String permArray;
}

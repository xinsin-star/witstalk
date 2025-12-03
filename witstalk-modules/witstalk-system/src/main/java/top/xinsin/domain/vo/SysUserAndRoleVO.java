package top.xinsin.domain.vo;

import lombok.Data;

@Data
public class SysUserAndRoleVO {
    private Long userId;
    private Long roleId;
    private Long id;
    private String username;
    private String nickName;
    private String email;
}

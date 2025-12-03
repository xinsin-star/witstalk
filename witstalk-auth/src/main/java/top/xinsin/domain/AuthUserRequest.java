package top.xinsin.domain;

import lombok.Data;

import java.util.List;

@Data
public class AuthUserRequest {
    private Long id;
    private String username;
    private String nickName;
    private String password;
    private List<String> roles;
    private List<String> permissions;
}

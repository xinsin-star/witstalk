package top.xinsin.entity;

import com.fasterxml.jackson.databind.ser.Serializers;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class LoginUser extends Serializers.Base {
    private Long userId;
    private String username;
    private String password;
    private String nickName;
    private List<String> roles;
    private List<String> permissions;
}

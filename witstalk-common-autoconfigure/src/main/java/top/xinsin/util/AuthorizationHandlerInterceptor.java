package top.xinsin.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import top.xinsin.annotation.AuthorizationRequired;

@Component
public class AuthorizationHandlerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,@NonNull Object handler) {
        if (handler instanceof HandlerMethod method) {
            if (!method.hasMethodAnnotation(AuthorizationRequired.class)) {
                return true;
            }
            SecurityUtil.getLoginUser(request);
            return true;
        }
        return true;
    }
}
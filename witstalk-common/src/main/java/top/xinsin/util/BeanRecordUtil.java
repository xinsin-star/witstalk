package top.xinsin.util;

import org.springframework.util.CollectionUtils;

import java.lang.reflect.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static io.jsonwebtoken.lang.Strings.capitalize;

public class BeanRecordUtil {

    public static <B, R> R beanConvertRecord(B bean, Class<R> rclass) {
        if (bean == null) {
            throw new IllegalArgumentException("bean is null");
        }
        if (rclass == null) {
            throw new IllegalArgumentException("rClass is null");
        }
        if (!rclass.isRecord()) {
            throw new IllegalArgumentException(String.format("类 [%s] 不是 Record 类型，请传入合法的 Record 类", rclass.getName()));
        }
        RecordComponent[] recordComponents = rclass.getRecordComponents();
        // 1. 收集Record每个字段的对应值
        Object[] fieldValues = new Object[recordComponents.length];
        for (int i = 0; i < recordComponents.length; i++) {
            RecordComponent component = recordComponents[i];
            String fieldName = component.getName();
            String methodName = "get" + capitalize(fieldName);
            try {
                // 从实体中获取对应字段的值
                Method method = bean.getClass().getMethod(methodName);
                Object value = method.invoke(bean);

                // 2. 如果是children字段，递归转换子实体列表为子VO列表
                if ("children".equals(fieldName)) {
                    List<R> childEntities = (List<R>) value;
                    if (CollectionUtils.isEmpty(childEntities)) {
                        fieldValues[i] = Collections.emptyList();
                    } else {
                        // 获取children字段的泛型类型（如List<SysChannelTreeVO>）
                        Type genericType = component.getGenericType();
                        if (genericType instanceof ParameterizedType parameterizedType) {
                            Class<?> childVoClass = (Class<?>) parameterizedType.getActualTypeArguments()[0];
                            // 递归转换子实体
                            List<Object> childVos = childEntities.stream()
                                    .map(child -> beanConvertRecord(child, childVoClass))
                                    .collect(Collectors.toList());
                            fieldValues[i] = childVos;
                        } else {
                            fieldValues[i] = Collections.emptyList();
                        }
                    }
                } else {
                    // 普通字段直接赋值
                    fieldValues[i] = value;
                }
            } catch (IllegalAccessException e) {
                // 实体中无该字段，赋值为null
                fieldValues[i] = null;
            } catch (InvocationTargetException | NoSuchMethodException e) {
                throw new RuntimeException("调用" + methodName + "方法失败", e);
            }
        }

        try {
            return rclass.getDeclaredConstructor(
                    Arrays.stream(recordComponents)
                            .map(RecordComponent::getType)
                            .toArray(Class[]::new)
            ).newInstance(fieldValues);
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            throw new RuntimeException("创建 Record 实例失败", e);
        }

//        ArrayList<Object> params = new ArrayList<>();
//        RecordComponent[] recordComponents = rclass.getRecordComponents();
//        Class<?>[] componentTypes = new Class[recordComponents.length];
//
//        for (int i = 0; i < recordComponents.length; i++) {
//            RecordComponent recordComponent = recordComponents[i];
//            // 记录组件类型，用于后续获取构造器
//            componentTypes[i] = recordComponent.getType();
//
//            String methodName = "get" + capitalize(recordComponent.getName());
//            try {
//                Method method = bean.getClass().getMethod(methodName);
//                Object invoke = method.invoke(bean);
//                params.add(invoke);
//            } catch (NoSuchMethodException e) {
//                throw new RuntimeException("没有找到" + methodName + "方法", e);
//            } catch (InvocationTargetException | IllegalAccessException e) {
//                throw new RuntimeException("调用" + methodName + "方法失败", e);
//            }
//        }
//        try {
//            return rclass.getConstructor(componentTypes).newInstance(Arrays.copyOf(params.toArray(), params.size()));
//        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
//            throw new RuntimeException("创建 Record 实例失败", e);
//        }
    }

}

import { Select } from 'antd';
import { useRequest } from '~/hook/useRequest.ts';

const { Option } = Select;

const url = {
    list: '/system/sysDictType/listByDictType',
}

interface DictTypeProps {
    dictType: string;
    value?: any;
    onChange?: (value: any) => void;
    placeholder?: string;
    mode?: 'single' | 'multiple';
    maxTagCount?: number;
    maxSelectCount?: number;
    disabled?: boolean;
    className?: string;
}

export default function DictType({
    dictType,
    value,
    onChange,
    placeholder = '请选择',
    mode = 'single',
    maxTagCount = 3,
    maxSelectCount = 0,
    disabled = false,
    className = ''
}: DictTypeProps) {
    // 获取字典项数据
    const { data, error } = useRequest({
        url: `${url.list}?dictType=${dictType}`,
        method: 'POST'
    });

    // 处理选择变化
    const handleChange = (newValue: any) => {
        if (mode === 'multiple' && maxSelectCount > 0) {
            const newValueArray = Array.isArray(newValue) ? newValue : [];
            if (newValueArray.length > maxSelectCount) {
                return; // 超过最大选择数量，不触发 onChange
            }
        }
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            mode={mode === 'multiple' ? 'multiple' : undefined}
            maxTagCount={maxTagCount}
            disabled={disabled}
            className={className}
            loading={!data && !error}
        >
            {data?.map((item: any) => (
                <Option key={item.dictValue} value={item.dictValue}>
                    {item.dictName}
                </Option>
            ))}
        </Select>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { selectDictList } from '~/api/system/dict';

export interface DictItem {
    dictLabel: string;
    dictValue: string | number;
    [key: string]: any;
}

export const useDictType = (dictType: string) => {
    const [dictList, setDictList] = useState<DictItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDict = useCallback(
        async (targetType = dictType) => {
            // 空类型直接重置状态
            if (!targetType) {
                setDictList([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await selectDictList(targetType);
                setDictList(response.data || []);
            } catch (error: any) {
                console.error('Error fetching dict list:', error);
            } finally {
                setLoading(false);
            }
        },[dictType]
    )

    useEffect(() => {
        fetchDict(dictType);
    }, [dictType, fetchDict]);

    // 手动刷新字典（重新发起请求）
    const refresh = useCallback(() => {
        if (dictType) {
            fetchDict(dictType);
        }
    }, [dictType, fetchDict]);

    return {
        dictList,
        loading,
        refresh
    };
};
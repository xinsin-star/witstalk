import { useState, useEffect, useCallback } from 'react';
import { selectDictList } from '~/api/system/dict';

export const useDictType = (dictType: string) => {
    const [dictList, setDictList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDict = useCallback(
        async (targetType) => {
            // 空类型直接重置状态
            if (!targetType) {
                setDictList([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await selectDictList(dictType);
                setDictList(response.data || []);
            } catch (error) {
                console.error('Error fetching dict list:', error);
            } finally {
                setLoading(false);
            }
        },[]
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
import { request } from "~/util/request"

export const selectDictList = async (dictType: string) => {
    return request({
        url: `/system/sysDictType/listByDictType?dictType=${dictType}`,
        method: 'POST',
    })
}
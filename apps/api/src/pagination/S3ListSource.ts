import { ListPageVariant } from "../entities/getListJSONKey"

export type S3ListSource = Readonly<{
    getIndexKey: () => string
    getPageKey: (pageIndex: number, variant: ListPageVariant) => string
    isEligible: (listQuery: Readonly<Record<string, string | number | boolean | undefined>>) => boolean
}>

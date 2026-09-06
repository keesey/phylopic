export type S3ListSource = Readonly<{
    getIndexKey: () => string
    getPageKey: (pageIndex: number) => string
    isEligible: (listQuery: Readonly<Record<string, string | number | boolean | undefined>>) => boolean
}>

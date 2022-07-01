export type FileResult = Readonly<{
    buffer: Buffer
    file: File
    source: string
    size: Readonly<[number, number]>
}>

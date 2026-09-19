export type GameInstance<TContent> = Readonly<{
    meta: Readonly<{
        author: Readonly<{
            href?: string
            name: string
        }>
    }>
    content: TContent
}>

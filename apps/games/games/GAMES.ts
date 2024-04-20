export type Game = Readonly<{
    author: {
        href: string
        name: string
    }
    summary: string
    title: string
}>
export const GAMES: Record<string, Game> = {
    "four-clades": {
        author: {
            href: "https://www.phylopic.org/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f/t-michael-keesey-silhouettes",
            name: "Mike Keesey",
        },
        summary:
            'Sort these silhouettes into four clades. (A clade is an ancestor plus all descendants, like "mammals" or "falcons" or "flowering plants".',
        title: "Four Clades",
    },
}

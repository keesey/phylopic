export type Game = Readonly<{
    author: {
        href: string
        name: string
    }
    summary: string
    title: string
}>
const MIKE_KEESEY = {
    href: "https://www.phylopic.org/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f/t-michael-keesey-silhouettes",
    name: "Mike Keesey",
}
export const GAMES: Record<string, Game> = {
    ancestor: {
        author: MIKE_KEESEY,
        summary: "Figure out which silhouette represents the ancestor.",
        title: "Ancestor",
    },
    "four-clades": {
        author: MIKE_KEESEY,
        summary: "Sort sixteen silhouette images into four clades. (A clade is an ancestor plus all descendants.)",
        title: "Four Clades",
    },
}

export type GBIFRank = "species" | "genus" | "family" | "order" | "class" | "phylum" | "kingdom"
export type GBIFNameUsage = Readonly<Partial<Record<GBIFRank, string>>> &
    Readonly<Partial<Record<`${GBIFRank}Key`, number>>> &
    Partial<
        Readonly<{
            canonicalName: string
            higherClassificationMap: Readonly<Record<string, string>>
            key: number
            nameKey: number
            nubKey: number
            parent: string
            parentKey: number
            rank: string
            scientificName: string
            status: string
            synonym: boolean
        }>
    >

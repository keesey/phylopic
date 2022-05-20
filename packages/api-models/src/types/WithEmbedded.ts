import { Links } from "./Links"
export type WithEmbedded<
    TEntity extends { readonly _links: TLinks },
    TLinks extends Links,
    TEmbeds extends string & keyof TLinks,
    TEmbedded extends Readonly<Record<TEmbeds, unknown>>,
> = TEntity & {
    readonly _embedded: Partial<TEmbedded>
}

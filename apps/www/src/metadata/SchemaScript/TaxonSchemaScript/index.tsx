import { Node } from "@phylopic/api-models"
import { isDefined, shortenNomen, stringifyNomen } from "@phylopic/utils"
import { FC, useMemo } from "react"
import { Taxon, WithContext } from "schema-dts"
import resolveExternalHRef from "~/models/resolveExternalHRef"
import getImageHRef from "~/routes/getImageHRef"
import getNodeHRef from "~/routes/getNodeHRef"
import SchemaScript from ".."

export type Props = {
    node: Node
}
const TaxonSchemaScript: FC<Props> = ({ node }) => {
    const object = useMemo<WithContext<Taxon>>(() => {
        const name = stringifyNomen(node.names[0])
        const alternateNames = new Set([
            ...node.names.map(stringifyNomen),
            ...node.names.map(name => stringifyNomen(shortenNomen(name))),
        ])
        alternateNames.delete(name)
        const sameAs = [
            `${process.env.NEXT_PUBLIC_WWW_URL}/nodes/${encodeURIComponent(node.uuid)}`,
            ...node._links.external.map(({ href }) => resolveExternalHRef(href)).filter(isDefined),
        ]
        const url = `${process.env.NEXT_PUBLIC_WWW_URL}${getNodeHRef(node._links.self)}`
        return {
            "@context": "https://schema.org",
            "@type": "Taxon",
            "@id": url,
            alternateName: alternateNames.size ? Array.from(alternateNames).sort() : undefined,
            childTaxon: node._links.childNodes.length
                ? node._links.childNodes.map(link => `${process.env.NEXT_PUBLIC_WWW_URL}${getNodeHRef(link)}`)
                : undefined,
            identifier: node.uuid,
            image: node._links.primaryImage
                ? `${process.env.NEXT_PUBLIC_WWW_URL}${getImageHRef(node._links.primaryImage)}`
                : undefined,
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_WWW_URL}${getNodeHRef(node._links.self)}`,
            name,
            parentTaxon: node._links.parentNode
                ? `${process.env.NEXT_PUBLIC_WWW_URL}${getNodeHRef(node._links.parentNode)}`
                : undefined,
            sameAs: sameAs.length ? sameAs : undefined,
            url,
        }
    }, [node])
    return <SchemaScript id="Taxon" object={object} />
}
export default TaxonSchemaScript

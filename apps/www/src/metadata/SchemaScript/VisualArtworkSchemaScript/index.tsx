import { Image } from "@phylopic/api-models"
import { extractPath } from "@phylopic/utils"
import { FC, useMemo } from "react"
import { ImageObject, Thing, VisualArtwork, WithContext } from "schema-dts"
import SchemaScript from ".."

export type Props = {
    image: Image
}
const VisualArtworkSchemaScript: FC<Props> = ({ image }) => {
    const object = useMemo<WithContext<VisualArtwork>>(() => {
        const url = `${process.env.NEXT_PUBLIC_WWW_URL}/images/${image.uuid}`
        const taxonURL = `${process.env.NEXT_PUBLIC_WWW_URL}${extractPath(image._links.specificNode.href)}`
        const contributorURL = `${process.env.NEXT_PUBLIC_WWW_URL}${extractPath(image._links.contributor.href)}`
        const about = image._links.nodes.map<Thing>(link => ({
            "@type": "Taxon",
            "@id": taxonURL,
        }))
        return {
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            "@id": url,
            about,
            accountablePerson: contributorURL,
            datePublished: image.created,
            contributor: { "@id": contributorURL },
            creditText: image.attribution ?? undefined,
            identifier: image.uuid,
            images: [
                image._links.sourceFile,
                image._links.vectorFile,
                ...image._links.rasterFiles,
                ...image._links.thumbnailFiles,
            ].map(link => {
                const [width, height] = link.sizes.split("x", 2)
                return {
                    "@type": "ImageObject",
                    "@id": link.href,
                    accountablePerson: contributorURL,
                    contentUrl: link.href,
                    creditText: image.attribution ?? "Anonymous",
                    encodingFormat: link.type,
                    height: {
                        unitText: "pixels",
                        value: parseFloat(height),
                    },
                    license: image._links.license.href,
                    mainEntity: {
                        "@type": "Taxon",
                        "@id": taxonURL,
                    },
                    representativeOfPage: url,
                    width: {
                        unitText: "pixels",
                        value: parseFloat(width),
                    },
                } as ImageObject
            }),
            license: image._links.license.href,
            mainEntity: {
                "@type": "Taxon",
                "@id": taxonURL,
            },
            sponsor: image.sponsor ?? undefined,
            thumbnailUrl: image._links.thumbnailFiles[0].href,
            url,
        }
    }, [image])
    return <SchemaScript id="VisualArtwork" object={object} />
}
export default VisualArtworkSchemaScript

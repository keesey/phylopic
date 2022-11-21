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
        const url = `https://www.phylopic.org/images/${image.uuid}`
        const about = image._links.nodes.map<Thing>(link => ({
            "@type": "Taxon",
            "@id": "https://www.phylopic.org" + extractPath(link.href),
        }))
        return {
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            "@id": url,
            about,
            datePublished: image.created,
            contributor: { "@id": "https://www.phylopic.org" + extractPath(image._links.contributor.href) },
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
                    contentUrl: link.href,
                    encodingFormat: link.type,
                    height: {
                        unitText: "pixels",
                        value: parseFloat(height),
                    },
                    width: {
                        unitText: "pixels",
                        value: parseFloat(width),
                    },
                } as ImageObject
            }),
            license: image._links.license.href,
            mainEntity: {
                "@type": "Taxon",
                "@id": "https://www.phylopic.org" + extractPath(image._links.specificNode.href),
            },
            sponsor: image.sponsor ?? undefined,
            thumbnailUrl: image._links.thumbnailFiles[0].href,
            url,
        }
    }, [image])
    return <SchemaScript id="VisualArtwork" object={object} />
}
export default VisualArtworkSchemaScript

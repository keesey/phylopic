import { ImageListParameters, ImageWithEmbedded, Node } from "@phylopic/api-models"
import { PaginationContainerProps } from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import { FC, useMemo } from "react"
import getCladeImagesUUID from "~/models/getCladeImagesUUID"
import ImageLicensePaginator from "./ImageLicensePaginator"
export type Props = Omit<PaginationContainerProps<ImageWithEmbedded>, "endpoint"> & {
    node?: Node
}
const CladeImageLicensePaginator: FC<Props> = ({ node, ...otherProps }) => {
    const query = useMemo(
        () =>
            node
                ? ({ embed_specificNode: "true", filter_clade: getCladeImagesUUID(node) } as ImageListParameters &
                      Query)
                : null,
        [node],
    )
    return query ? <ImageLicensePaginator {...otherProps} query={query} /> : null
}
export default CladeImageLicensePaginator

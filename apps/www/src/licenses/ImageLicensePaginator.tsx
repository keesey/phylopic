import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { PaginationContainer, PaginationContainerProps } from "@phylopic/ui"
import { FC, useMemo } from "react"
import useLicenseFilterQuery from "./useLicenseFilterQuery"
export type Props = Omit<PaginationContainerProps<ImageWithEmbedded>, "endpoint"> & {
    query?: ImageListParameters
}
const ImageLicensePaginator: FC<Props> = props => {
    const licenseFilter = useLicenseFilterQuery()
    const query = useMemo(
        () => ({
            ...props.query,
            ...licenseFilter,
        }),
        [licenseFilter, props.query],
    )
    return (
        <PaginationContainer
            {...(props as PaginationContainerProps)}
            endpoint={"https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/images"}
            query={query}
        />
    )
}
export default ImageLicensePaginator

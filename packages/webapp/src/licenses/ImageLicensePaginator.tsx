import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import PaginationContainer, { Props as PaginationContainerProps } from "~/swr/pagination/PaginationContainer"
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
            endpoint={process.env.NEXT_PUBLIC_API_URL + "/images"}
            query={query}
        />
    )
}
export default ImageLicensePaginator

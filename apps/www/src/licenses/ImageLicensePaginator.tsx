import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { PaginationContainer, PaginationContainerProps } from "@phylopic/ui"
import { FC, useContext, useMemo } from "react"
import customEvents from "~/analytics/customEvents"
import LicenseFilterTypeContext from "./LicenseFilterTypeContext"
import useLicenseFilterQuery from "./useLicenseFilterQuery"
export type Props = Omit<PaginationContainerProps<ImageWithEmbedded>, "endpoint" | "onPage"> & {
    query?: ImageListParameters
}
const ImageLicensePaginator: FC<Props> = props => {
    const [licenses] = useContext(LicenseFilterTypeContext) ?? []
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
            {...props}
            endpoint={process.env.NEXT_PUBLIC_API_URL + "/images"}
            onPage={index => customEvents.loadImageListPage("images", index, licenses)}
            query={query}
        />
    )
}
export default ImageLicensePaginator

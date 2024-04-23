import { useLicenseText } from "@phylopic/client-components"
import { LicenseURL } from "@phylopic/utils"
import { FC } from "react"
import customEvents from "~/analytics/customEvents"
export interface Props {
    short?: boolean
    value: LicenseURL
}
const LicenseView: FC<Props> = ({ value, short }) => {
    const text = useLicenseText(value, short)
    return (
        <a href={value} onClick={() => customEvents.clickLink("license", value, text ?? "", "link")} rel="license">
            {text}
        </a>
    )
}
export default LicenseView

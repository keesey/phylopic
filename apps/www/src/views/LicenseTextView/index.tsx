import { useLicenseText } from "@phylopic/ui"
import { LicenseURL } from "@phylopic/utils"
import { FC } from "react"
export interface Props {
    short?: boolean
    value: LicenseURL
}
const LicenseTextView: FC<Props> = ({ value, short }) => {
    const text = useLicenseText(value, short)
    return <>{text}</>
}
export default LicenseTextView

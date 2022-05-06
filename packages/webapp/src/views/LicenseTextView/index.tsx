import { LicenseURL } from "@phylopic/utils/dist/models/types"
import { FC } from "react"
import useLicenseText from "~/hooks/useLicenseText"
export interface Props {
    short?: boolean
    value: LicenseURL
}
const LicenseTextView: FC<Props> = ({ value, short }) => {
    const text = useLicenseText(value, short)
    return <>{text}</>
}
export default LicenseTextView

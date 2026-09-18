import { useLicenseText } from "@phylopic/client-components"
import type { LicenseURL } from "@phylopic/utils"
import type { FC } from "react"

export interface Props {
    short?: boolean
    value: LicenseURL
}

const LicenseTextView: FC<Props> = ({ value, short }) => {
    const text = useLicenseText(value, short)
    return <>{text}</>
}

export default LicenseTextView

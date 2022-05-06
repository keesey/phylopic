import { LicenseURL } from "@phylopic/utils/dist/models/types"
import { FC } from "react"
import LicenseTextView from "../LicenseTextView"
export interface Props {
    short?: boolean
    value: LicenseURL
}
const LicenseView: FC<Props> = ({ value, short }) => (
    <a href={value}>
        <LicenseTextView value={value} short={short} />
    </a>
)
export default LicenseView

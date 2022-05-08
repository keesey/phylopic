import clsx from "clsx"
import { FC, useContext, useEffect, useMemo, useState } from "react"
import LicenseFilterView from "~/views/LicenseFilterView"
import NumberView from "~/views/NumberView"
import LicenseFilterTypeContext from "../LicenseFilterTypeContext"
import styles from "./index.module.scss"
export interface Props {
    total?: number
}
const ImageLicenseControls: FC<Props> = ({ total }) => {
    const [licenses, setLicenses] = useContext(LicenseFilterTypeContext) ?? []
    const [lastValidTotal, setLastValidTotal] = useState(() => (typeof total !== "number" || isNaN(total) ? 0 : total))
    useEffect(() => {
        if (typeof total === "number" && !isNaN(total)) {
            setLastValidTotal(total)
        }
    }, [total])
    if (typeof total !== "number") {
        return null
    }
    const totalDisplayed = useMemo(() => isNaN(total) ? lastValidTotal : total, [lastValidTotal, total])
    return (
        <>
            <p className={clsx(isNaN(total) && styles.pending)}>
                <NumberView value={totalDisplayed} /> {licenses ? "matching " : ""}silhouette image
                {totalDisplayed === 1 ? "" : "s"}
                {licenses ? "" : " in the database"}.
            </p>
            <LicenseFilterView onChange={setLicenses} pending={isNaN(total)} value={licenses} />
        </>
    )
}
export default ImageLicenseControls

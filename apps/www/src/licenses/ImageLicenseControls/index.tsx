import { CountView } from "@phylopic/ui"
import clsx from "clsx"
import { FC, useContext, useEffect, useMemo, useState } from "react"
import customEvents from "~/analytics/customEvents"
import LicenseFilterView from "~/views/LicenseFilterView"
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
    const totalDisplayed = useMemo(
        () => (typeof total !== "number" || isNaN(total) ? lastValidTotal : total),
        [lastValidTotal, total],
    )
    if (typeof total !== "number") {
        return null
    }
    return (
        <>
            <p className={clsx(isNaN(total) && styles.pending)}>
                <CountView value={totalDisplayed} /> {licenses ? "matching " : ""}silhouette image
                {totalDisplayed === 1 ? "" : "s"}
                {licenses ? "" : " in all"}.
            </p>
            <LicenseFilterView
                onChange={value => {
                    customEvents.filterImages(value)
                    setLicenses?.(value)
                }}
                pending={isNaN(total)}
                value={licenses}
            />
        </>
    )
}
export default ImageLicenseControls

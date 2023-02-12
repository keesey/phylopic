import clsx from "clsx"
import { FC } from "react"
import { LicenseFilterType } from "~/models/LicenseFilterType"
import styles from "./index.module.scss"
export interface Props {
    onChange?: (value: LicenseFilterType) => void
    pending?: boolean
    value: LicenseFilterType
}
const LicenseFilterView: FC<Props> = ({ onChange, pending, value }) => {
    return (
        <form className={clsx(styles.main, pending && styles.pending)}>
            <strong>Licenses</strong>
            <div className={styles.option}>
                <input
                    disabled={pending}
                    id="license_all"
                    type="radio"
                    checked={value === undefined}
                    onClick={() => onChange?.(undefined)}
                    readOnly
                />
                <label htmlFor="license_all">all</label>
            </div>
            <div className={styles.option}>
                <input
                    disabled={pending}
                    id="license_publicdomain"
                    type="radio"
                    checked={value === "publicdomain"}
                    onClick={() => onChange?.("publicdomain")}
                    readOnly
                />
                <label htmlFor="license_publicdomain">
                    public domain{" "}
                    <a href="https://creativecommons.org/share-your-work/public-domain/" rel="external">
                        ⓘ
                    </a>
                </label>
            </div>
            <div className={styles.option}>
                <input
                    disabled={pending}
                    id="license_commercial"
                    type="checkbox"
                    checked={value === "-nc" || value === "-nc-sa"}
                    onClick={() =>
                        onChange?.(
                            value === "-nc-sa"
                                ? "-sa"
                                : value === "-sa"
                                ? "-nc-sa"
                                : value === "-nc"
                                ? undefined
                                : "-nc",
                        )
                    }
                    readOnly
                />
                <label htmlFor="license_commercial">
                    free for commercial use{" "}
                    <a
                        href="https://creativecommons.org/faq/#does-my-use-violate-the-noncommercial-clause-of-the-licenses"
                        rel="external"
                    >
                        ⓘ
                    </a>
                </label>
            </div>
            <div className={styles.option}>
                <input
                    disabled={pending}
                    id="license_nosharealike"
                    type="checkbox"
                    checked={value === "-sa" || value === "-nc-sa"}
                    onClick={() =>
                        onChange?.(
                            value === "-nc-sa"
                                ? "-nc"
                                : value === "-nc"
                                ? "-nc-sa"
                                : value === "-sa"
                                ? undefined
                                : "-sa",
                        )
                    }
                    readOnly
                />
                <label htmlFor="license_nosharealike">
                    no ShareAlike requirement{" "}
                    <a href="https://wiki.creativecommons.org/wiki/ShareAlike_interpretation" rel="external">
                        ⓘ
                    </a>
                </label>
            </div>
        </form>
    )
}
export default LicenseFilterView

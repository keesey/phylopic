import { Authority } from "@phylopic/utils"
import { FC } from "react"
import styles from "./index.module.scss"
export type Props = {
    authority: Authority
}
const AuthorityIcon: FC<Props> = ({ authority }) => {
    if (authority === "eol.org") {
        return <img alt="Encyclopedia of Life" src="/logos/eol.svg" className={styles.main} />
    }
    if (authority === "opentreeoflife.org") {
        return <img alt="Open Tree of Life" src="/logos/otol.svg" className={styles.main} />
    }
    return null
}
export default AuthorityIcon

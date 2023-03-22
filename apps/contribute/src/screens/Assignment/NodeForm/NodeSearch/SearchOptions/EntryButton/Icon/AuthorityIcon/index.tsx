import { Authority } from "@phylopic/utils"
import Image from "next/image"
import { FC } from "react"
import styles from "./index.module.scss"
export type Props = {
    authority: Authority
}
const AuthorityIcon: FC<Props> = ({ authority }) => {
    if (authority === "eol.org") {
        return (
            <Image
                alt="Encyclopedia of Life"
                src="/logos/eol.svg"
                unoptimized
                className={styles.main}
                width="24"
                height="24"
            />
        )
    }
    if (authority === "opentreeoflife.org") {
        return (
            <Image
                alt="Open Tree of Life"
                src="/logos/otol.svg"
                unoptimized
                className={styles.main}
                width="24"
                height="24"
            />
        )
    }
    if (authority === "paleobiodb.org") {
        return (
            <Image
                alt="Paleobiology Database"
                src="/logos/paleobiodb.svg"
                unoptimized
                className={styles.main}
                width="24"
                height="24"
            />
        )
    }
    return null
}
export default AuthorityIcon

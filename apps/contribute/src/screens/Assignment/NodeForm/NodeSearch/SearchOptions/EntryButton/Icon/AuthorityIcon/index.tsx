import { Authority } from "@phylopic/utils"
import Image from "next/image"
import { FC } from "react"
import styles from "./index.module.scss"
type IconInfo = Readonly<{
    alt: string
    aspectRatio: number
    src: string
}>
const ICONS: Readonly<Record<Authority, IconInfo | undefined>> = {
    "eol.org": {
        alt: "Encyclopedia of Life",
        aspectRatio: 58.8 / 321.4,
        src: "/logos/eol.svg",
    },
    "gbif.org": {
        alt: "Global Biodiversity Information Facility",
        aspectRatio: 231.5 / 92.3,
        src: "/logos/gbif.svg",
    },
    "opentreeoflife.org": {
        alt: "Open Tree of Life",
        aspectRatio: 58.08 / 30.72,
        src: "/logos/otol.svg",
    },
    "paleobiodb.org": {
        alt: "Paleobiology Database",
        aspectRatio: 1,
        src: "/logos/paleobiodb.svg",
    },
}
export type Props = {
    authority: Authority
}
const AuthorityIcon: FC<Props> = ({ authority }) => {
    const info = ICONS[authority]
    if (!info) {
        return null
    }
    return (
        <Image
            alt={info.alt}
            className={styles.main}
            height={info.aspectRatio <= 1 ? 64 : 64 / info.aspectRatio}
            src={info.src}
            unoptimized
            width={info.aspectRatio >= 1 ? 64 : 64 * info.aspectRatio}
        />
    )
}
export default AuthorityIcon

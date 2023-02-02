import { Nomen } from "@phylopic/utils"
import { FC, Fragment, useMemo } from "react"
import styles from "./index.module.scss"
export interface Props {
    defaultText?: string
    illustrated?: boolean
    short?: boolean
    value?: Nomen
}
const NameView: FC<Props> = ({ defaultText = "", short, value }) => {
    const parts = useMemo(
        () =>
            value
                ? short
                    ? value.filter(
                          (part, index, array) =>
                              part.class === "scientific" ||
                              part.class === "vernacular" ||
                              part.class === "operator" ||
                              (part.class === "rank" && index < array.length - 1),
                      )
                    : value
                : [],
        [value, short],
    )
    if (!parts.length) {
        return <>{defaultText}</>
    }
    if (parts.length === 1) {
        return <span className={`${styles.main} ${styles[parts[0].class]}`}>{parts[0].text}</span>
    }
    return (
        <span className={styles.main}>
            {parts.map((part, index) =>
                index ? (
                    <Fragment key={index}>
                        {" "}
                        <span className={styles[part.class]}>{part.text}</span>
                    </Fragment>
                ) : (
                    <span key={index} className={styles[part.class]}>
                        {part.text}
                    </span>
                ),
            )}
        </span>
    )
}
export default NameView

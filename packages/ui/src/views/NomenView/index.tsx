import { Nomen } from "@phylopic/utils"
import clsx from "clsx"
import { NomenPartClass } from "parse-nomen"
import React from "react"
export interface NomenViewProps {
    classes?: Partial<Record<"main" | NomenPartClass, string>>
    defaultText?: string
    illustrated?: boolean
    short?: boolean
    value?: Nomen
}
export const NomenView: React.FC<NomenViewProps> = ({ classes, defaultText = "", short, value }) => {
    const parts = React.useMemo(
        () =>
            value
                ? short
                    ? value.filter(
                          part =>
                              part.class === "scientific" || part.class === "vernacular" || part.class === "operator",
                      )
                    : value
                : [],
        [short, value],
    )
    if (!parts.length) {
        return <>{defaultText}</>
    }
    if (parts.length === 1) {
        return <span className={clsx(classes?.main, classes?.[parts[0].class])}>{parts[0].text}</span>
    }
    return (
        <span className={classes?.main}>
            {parts.map((part, index) =>
                index ? (
                    <React.Fragment key={index}>
                        {" "}
                        <span className={classes?.[part.class]}>{part.text}</span>
                    </React.Fragment>
                ) : (
                    <span key={index} className={classes?.[part.class]}>
                        {part.text}
                    </span>
                ),
            )}
        </span>
    )
}
export default NomenView

import { type Nomen } from "@phylopic/utils"
import clsx from "clsx"
import { type NomenPartClass } from "parse-nomen"
import React from "react"
export interface NomenViewProps {
    classes?: Partial<Record<"main" | NomenPartClass, string>>
    defaultText?: string
    illustrated?: boolean
    short?: boolean
    value?: Nomen
}
export const NomenView: React.FC<NomenViewProps> = ({ classes, defaultText = "", short, value }) => {
    const parts = value
        ? short
            ? value.filter(
                  (part, index, array) =>
                      part.class === "scientific" ||
                      part.class === "vernacular" ||
                      part.class === "operator" ||
                      (part.class === "rank" && index < array.length - 1),
              )
            : value
        : []
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

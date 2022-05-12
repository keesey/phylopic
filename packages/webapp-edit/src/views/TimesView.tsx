import { ISOTimestamp } from "@phylopic/utils"
import React, { FC } from "react"
import DateView from "./DateView"

export interface Props {
    readonly created?: ISOTimestamp
    readonly modified?: ISOTimestamp
}
const TimesView: FC<Props> = ({ modified, created }) => {
    if (!created && !modified) {
        return null
    }
    return (
        <dl>
            {created && (
                <>
                    <dt>Created</dt>
                    <dd>
                        <DateView datetime={created} />
                    </dd>
                </>
            )}
            {modified && (
                <>
                    <dt>Modified</dt>
                    <dd>
                        <DateView datetime={modified} />
                    </dd>
                </>
            )}
        </dl>
    )
}
export default TimesView

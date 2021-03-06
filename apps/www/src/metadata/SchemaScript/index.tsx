import { stringifyNormalized } from "@phylopic/utils"
import Script from "next/script"
import { FC } from "react"
import { Thing, WithContext } from "schema-dts"
export type Props = {
    object: WithContext<Thing>
}
const SchemaScript: FC<Props> = ({ object }) => {
    return (
        <Script
            dangerouslySetInnerHTML={{
                __html: stringifyNormalized(object),
            }}
            type="application/ld+json"
        />
    )
}
export default SchemaScript

import { stringifyNormalized } from "@phylopic/utils"
import Script from "next/script"
import { FC } from "react"
import { Thing, WithContext } from "schema-dts"
export type Props = {
    id: string
    object: WithContext<Thing>
}
const SchemaScript: FC<Props> = ({ id, object }) => {
    return (
        <Script
            dangerouslySetInnerHTML={{
                __html: stringifyNormalized(object),
            }}
            id={`script:schema:${id}`}
            type="application/ld+json"
        />
    )
}
export default SchemaScript

import { stringifyNormalized } from "@phylopic/utils"
import { FC } from "react"
import { Thing, WithContext } from "schema-dts"
export type Props = {
    object: WithContext<Thing>
}
const SchemaMetadata: FC<Props> = ({ object }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: stringifyNormalized(object),
            }}
        />
    )
}
export default SchemaMetadata

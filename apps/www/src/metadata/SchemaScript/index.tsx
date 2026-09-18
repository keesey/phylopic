import { stringifyNormalized } from "@phylopic/utils"
import Head from "next/head"
import type { FC } from "react"
import type { Thing, WithContext } from "schema-dts"
export type Props = {
    id: string
    object: WithContext<Thing>
}
const SchemaScript: FC<Props> = ({ id, object }) => {
    return (
        <Head>
            <script
                dangerouslySetInnerHTML={{
                    __html: stringifyNormalized(object).replace(/</g, "\\u003c"),
                }}
                key={id ? `script:schema:${id}` : undefined}
                type="application/ld+json"
            />
        </Head>
    )
}
export default SchemaScript

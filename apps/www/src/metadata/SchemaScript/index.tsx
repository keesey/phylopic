import { stringifyNormalized } from "@phylopic/utils"
import Head from "next/head"
import { FC } from "react"
import { Thing, WithContext } from "schema-dts"
export type Props = {
    id: string
    object: WithContext<Thing>
}
const SchemaScript: FC<Props> = ({ id, object }) => {
    return (
        <Head>
            <script
                dangerouslySetInnerHTML={{
                    __html: stringifyNormalized(object),
                }}
                key={id ? `script:schema:${id}` : undefined}
                type="application/ld+json"
            />
        </Head>
    )
}
export default SchemaScript

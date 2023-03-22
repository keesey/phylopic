import { Contributor } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import { Person, WithContext } from "schema-dts"
import getContributorHRef from "~/routes/getContributorHRef"
import SchemaScript from ".."

export type Props = {
    contributor: Contributor
}
const PersonSchemaScript: FC<Props> = ({ contributor }) => {
    const object = useMemo<WithContext<Person>>(() => {
        const url = `${process.env.NEXT_PUBLIC_WWW_URL}${getContributorHRef(contributor._links.self)}`
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": url,
            email: contributor._links.contact?.href.replace(/^mailto:/, ""),
            identifier: contributor.uuid,
            name: contributor.name,
            url,
        }
    }, [contributor])
    return <SchemaScript id="Person" object={object} />
}
export default PersonSchemaScript

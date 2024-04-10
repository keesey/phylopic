import { URL } from "@phylopic/utils"
import { FC } from "react"
import SchemaScript from "~/metadata/SchemaScript"
import ItemListSchemaScript from "~/metadata/SchemaScript/ItemListSchemaScript"
const ITEM_URLS: readonly URL[] = [
    `${process.env.NEXT_PUBLIC_WWW_URL}/images`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/nodes`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/contributors`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/thanks`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/articles/api-recipes`,
    "http://api-docs.phylopic.org/v2",
    `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}`,
    "https://keesey.gumroad.com/l/pocketphylogenies",
]
const Schema: FC = () => (
    <>
        <SchemaScript
            id="WebSite"
            object={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                potentialAction: {
                    "@type": "SearchAction",
                    query: "required",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${process.env.NEXT_PUBLIC_WWW_URL}/search?q={query}`,
                    },
                },
                url: `${process.env.NEXT_PUBLIC_WWW_URL}`,
            }}
        />
        <SchemaScript
            id="Person"
            object={{
                "@context": "https://schema.org",
                "@id": "http://tmkeesey.net",
                "@type": "Person",
                alternateName: "T. Michael Keesey",
                email: "keesey@gmail.com",
                name: "Mike Keesey",
                sameAs: process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID
                    ? `${process.env.NEXT_PUBLIC_WWW_URL}/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`
                    : undefined,
                url: "http://tmkeesey.net",
            }}
        />
        <ItemListSchemaScript urls={ITEM_URLS} />
    </>
)
export default Schema

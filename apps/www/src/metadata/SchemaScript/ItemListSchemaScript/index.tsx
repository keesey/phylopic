import { URL } from "@phylopic/utils"
import { FC, useMemo } from "react"
import { ItemList, WithContext } from "schema-dts"
import SchemaScript from ".."

export type Props = {
    urls: readonly URL[]
}
const ItemListSchemaScript: FC<Props> = ({ urls }) => {
    const object = useMemo<WithContext<ItemList>>(
        () => ({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: urls.map((url, position) => ({
                "@type": "ListItem",
                position,
                url,
            })),
        }),
        [urls],
    )
    return <SchemaScript id="ItemList" object={object} />
}
export default ItemListSchemaScript

import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { EditField } from "../fields/EditField"
export const NODE_FIELDS: ReadonlyArray<EditField<Node & { uuid: UUID }>> = [
    {
        column: "created",
        insertable: false,
        property: "created",
        type: "timestamp without time zone",
        updateable: false,
    },
    {
        column: "modified",
        insertable: false,
        property: "modified",
        type: "timestamp without time zone",
        updateable: true,
    },
    { column: "names", insertable: true, property: "names", type: "json", updateable: true },
    { column: "parent_uuid", insertable: true, property: "parent", type: "uuid", updateable: true },
    { column: "uuid", insertable: true, property: "uuid", type: "uuid", updateable: false },
]

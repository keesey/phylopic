import { External } from "@phylopic/source-models"
import { EditField } from "../fields/EditField"
const EXTERNAL_FIELDS: ReadonlyArray<EditField<External>> = [
    { column: "node_uuid", insertable: true, property: "node", type: "uuid", updateable: true },
    { column: "title", insertable: true, property: "title", type: "character varying", updateable: true },
]
export default EXTERNAL_FIELDS

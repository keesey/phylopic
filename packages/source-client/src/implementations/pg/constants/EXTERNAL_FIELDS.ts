import { External } from "@phylopic/source-models"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { EditField } from "../fields/EditField"
const EXTERNAL_FIELDS: ReadonlyArray<
    EditField<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }>
> = [
    { column: "authority", insertable: true, property: "authority", type: "character varying", updateable: false },
    { column: "namespace", insertable: true, property: "namespace", type: "character varying", updateable: false },
    { column: "node_uuid", insertable: true, property: "node", type: "uuid", updateable: true },
    { column: "object_id", insertable: true, property: "objectID", type: "character varying", updateable: false },
    { column: "title", insertable: true, property: "title", type: "character varying", updateable: true },
]
export default EXTERNAL_FIELDS

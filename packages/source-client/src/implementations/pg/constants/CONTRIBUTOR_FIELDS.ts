import { Contributor } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { EditField } from "../fields/EditField"
const CONTRIBUTOR_FIELDS: ReadonlyArray<EditField<Contributor & { uuid: UUID }>> = [
    {
        column: "created",
        insertable: false,
        property: "created",
        type: "timestamp without time zone",
        updateable: false,
    },
    { column: "email", insertable: true, property: "emailAddress", type: "character varying", updateable: true },
    {
        column: "modified",
        insertable: false,
        property: "modified",
        type: "timestamp without time zone",
        updateable: true,
    },
    { column: "name", insertable: true, property: "name", type: "character varying", updateable: true },
    { column: "show_email", insertable: true, property: "showEmailAddress", type: "bit", updateable: true },
    { column: "uuid", insertable: true, property: "uuid", type: "uuid", updateable: false },
]
export default CONTRIBUTOR_FIELDS

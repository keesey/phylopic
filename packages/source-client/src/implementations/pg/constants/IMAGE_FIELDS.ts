import { Image } from "@phylopic/source-models"
import { EditField } from "../fields/EditField"
const IMAGE_FIELDS: ReadonlyArray<EditField<Image>> = [
    { column: "accepted", insertable: true, property: "accepted", type: "bit", updateable: true },
    { column: "attribution", insertable: true, property: "attribution", type: "character varying", updateable: true },
    { column: "contributor_uuid", insertable: true, property: "contributor", type: "uuid", updateable: false },
    {
        column: "created",
        insertable: false,
        property: "created",
        type: "timestamp without time zone",
        updateable: false,
    },
    { column: "general_uuid", insertable: true, property: "general", type: "uuid", updateable: true },
    { column: "license", insertable: true, property: "license", type: "character varying", updateable: true },
    {
        column: "modified",
        insertable: false,
        property: "modified",
        type: "timestamp without time zone",
        updateable: true,
    },
    { column: "specific_uuid", insertable: true, property: "specific", type: "uuid", updateable: true },
    { column: "sponsor", insertable: true, property: "sponsor", type: "character varying", updateable: true },
    { column: "submitted", insertable: true, property: "submitted", type: "bit", updateable: true },
]
export default IMAGE_FIELDS

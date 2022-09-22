import { External } from "@phylopic/source-models"
import { Authority, isAuthority, isNamespace, isObjectID, Namespace, ObjectID } from "@phylopic/utils"
import { PGClientProvider } from "../interfaces"
import EXTERNAL_FIELDS from "./pg/constants/EXTERNAL_FIELDS"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
import PGPatcher from "./pg/PGPatcher"
export default class ExternalClient extends PGPatcher<
    External & { authority: Authority; namespace: Namespace; objectID: ObjectID }
> {
    constructor(provider: PGClientProvider, authority: Authority, namespace: Namespace, objectID: ObjectID) {
        if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectID)) {
            throw new Error("Invalid external object specification.")
        }
        super(
            provider,
            EXTERNAL_TABLE,
            [
                { column: "authority", type: "character varying", value: authority },
                { column: "namespace", type: "character varying", value: namespace },
                { column: "object_id", type: "character varying", value: objectID },
            ],
            EXTERNAL_FIELDS,
        )
    }
}

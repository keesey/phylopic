import { Authority, Identifier, Namespace, ObjectID } from "../types"
const getIdentifierParts = (identifier: Identifier) =>
    identifier.split("/").map(x => decodeURIComponent(x)) as unknown as Readonly<[Authority, Namespace, ObjectID]>
export default getIdentifierParts

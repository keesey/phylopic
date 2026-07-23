import { Authority, Identifier, Namespace, ObjectID } from "../types"
export const getIdentifierParts = (identifier: Identifier) =>
    identifier.split("/").map(x => decodeURIComponent(x)) as unknown as Readonly<[Authority, Namespace, ObjectID]>

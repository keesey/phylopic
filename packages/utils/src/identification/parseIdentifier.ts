import { Authority } from "../models/types/Authority"
import { Identifier } from "../models/types/Identifier"
import { Namespace } from "../models/types/Namespace"
import { ObjectID } from "../models/types/ObjectID"
export const parseIdentifier = (identifier: Identifier) => identifier.split(/\//, 3) as [Authority, Namespace, ObjectID]
export default parseIdentifier

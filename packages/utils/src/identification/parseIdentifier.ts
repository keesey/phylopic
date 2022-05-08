import { Authority } from "../models/types/Authority.js"
import { Identifier } from "../models/types/Identifier.js"
import { Namespace } from "../models/types/Namespace.js"
import { ObjectID } from "../models/types/ObjectID.js"
export const parseIdentifier = (identifier: Identifier) => identifier.split(/\//, 3) as [Authority, Namespace, ObjectID]
export default parseIdentifier

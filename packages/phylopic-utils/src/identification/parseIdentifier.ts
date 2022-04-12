import { Authority, Identifier, Namespace, ObjectID } from "../models"
export const parseIdentifier = (identifier: Identifier) => identifier.split(/\//, 3) as [Authority, Namespace, ObjectID]
export default parseIdentifier
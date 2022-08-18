import { Authority, Identifier, Namespace, ObjectID } from "@phylopic/utils"
const getIdentifier = (x: Readonly<{ authority: Authority; namespace: Namespace; objectID: ObjectID }>): Identifier =>
    [x.authority, x.namespace, x.objectID].map(x => encodeURIComponent(x)).join("/")
export default getIdentifier

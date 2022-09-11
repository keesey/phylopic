import { Image } from "@phylopic/api-models"
import { Authority, Namespace, Nomen, ObjectID, UUID } from "@phylopic/utils"
export type SearchEntry = Readonly<{
    authority: Authority
    image?: Image
    name: Nomen
    namespace: Namespace
    objectID: ObjectID
}>

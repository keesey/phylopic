import type { Image } from "@phylopic/api-models"
import { type Authority, type Namespace, type Nomen, type ObjectID } from "@phylopic/utils"

export type SearchEntry = Readonly<{
    authority: Authority
    image?: Image
    name: Nomen
    namespace: Namespace
    objectID: ObjectID
}>

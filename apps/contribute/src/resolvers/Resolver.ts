import type { Node } from "@phylopic/source-models"
import type { ObjectID, UUID } from "@phylopic/utils"
import type SourceClient from "~/source/SourceClient"
export type Resolver = (client: SourceClient, objectID: ObjectID) => Promise<Node & { uuid: UUID }>

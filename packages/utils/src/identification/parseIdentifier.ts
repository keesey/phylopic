import type { Authority } from "../models/types/Authority"
import type { Identifier } from "../models/types/Identifier"
import type { Namespace } from "../models/types/Namespace"
import type { ObjectID } from "../models/types/ObjectID"

export const parseIdentifier = (identifier: Identifier) => identifier.split(/\//, 3) as [Authority, Namespace, ObjectID]

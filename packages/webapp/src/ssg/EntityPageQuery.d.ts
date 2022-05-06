import { UUID } from "@phylopic/utils/dist/models/types"
import { ParsedUrlQuery } from "querystring"
export type EntityPageQuery = ParsedUrlQuery & { uuid: UUID }

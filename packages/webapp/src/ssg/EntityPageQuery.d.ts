import { UUID } from "@phylopic/utils"
import { ParsedUrlQuery } from "querystring"
export type EntityPageQuery = ParsedUrlQuery & { uuid: UUID }

import { UUID, UUIDish } from "@phylopic/utils"
import { ParsedUrlQuery } from "querystring"
export type EntityPageQuery = ParsedUrlQuery & { uuid: UUID | UUIDish; slug?: string }

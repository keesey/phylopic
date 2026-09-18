import type { UUID, UUIDish } from "@phylopic/utils"
import type { ParsedUrlQuery } from "querystring"

export type EntityPageQuery = ParsedUrlQuery & { uuid: UUID | UUIDish; slug?: string }

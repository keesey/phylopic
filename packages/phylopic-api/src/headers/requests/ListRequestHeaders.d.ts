import { DataRequestHeaders } from "./DataRequestHeaders"
export interface ListRequestHeaders extends DataRequestHeaders {
    "if-match"?: string
}

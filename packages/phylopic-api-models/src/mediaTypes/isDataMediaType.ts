import { DATA_MEDIA_TYPE } from "."
import { DataMediaType } from "./DataMediaType"
export const isDataMediaType = (x: unknown): x is DataMediaType => x === DATA_MEDIA_TYPE
export default isDataMediaType

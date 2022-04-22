import DATA_MEDIA_TYPE from "../../mediaTypes/DATA_MEDIA_TYPE"
import PERMANENT_HEADERS from "./PERMANENT_HEADERS"
const DATA_HEADERS = {
    ...PERMANENT_HEADERS,
    "content-type": DATA_MEDIA_TYPE,
}
export default DATA_HEADERS

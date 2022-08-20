import { TTL } from "./TTL"
import { TTL_VALUES } from "./TTL_VALUES"
const getTTL = (x: number): TTL | undefined => (Object.keys(TTL_VALUES) as TTL[]).find(key => TTL_VALUES[key] === x)
export default getTTL

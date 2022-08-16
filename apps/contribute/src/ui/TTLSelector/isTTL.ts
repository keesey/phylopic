import { TTL } from "./TTL";
import { TTL_VALUES } from "./TTL_VALUES";
const isTTL = (x: unknown): x is TTL => Boolean(TTL_VALUES[x as TTL])
export default isTTL

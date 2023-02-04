import { compress, Compressed } from "compress-json"
import type { SWRConfiguration } from "swr"
const compressFallback: (fallback: NonNullable<SWRConfiguration["fallback"]>) => Compressed = compress
export default compressFallback

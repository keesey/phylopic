import { encodeKeySegment } from "./encodeKeySegment"

export const getBuildPrefix = (build: number) => encodeKeySegment(build) + "/"

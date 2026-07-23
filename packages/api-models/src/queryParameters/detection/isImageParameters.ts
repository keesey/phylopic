import { ImageEmbedded } from "../../types"
import { IMAGE_EMBEDDED_PARAMETERS } from "../constants/IMAGE_EMBEDDED_PARAMETERS"
import { isEntityParameters } from "./isEntityParameters"
export const isImageParameters = isEntityParameters<ImageEmbedded>(IMAGE_EMBEDDED_PARAMETERS)

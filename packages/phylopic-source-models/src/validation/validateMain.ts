import { Main } from "../models/Main"
import { validateUUID } from "./validateUUID"

export const validateMain = (value: Main, normalized?: boolean) => {
    if (
        typeof value?.build !== "number" ||
        !isFinite(value.build) ||
        value.build < 0 ||
        value.build !== Math.round(value.build)
    ) {
        throw new Error(`Invalid build number: ${value?.build}`)
    }
    validateUUID(value.root, normalized)
}

import { isArray, type ValidationFaultCollector } from "@phylopic/utils"
import { type ErrorResponse } from "../types/ErrorResponse"
import { isData } from "./isData"
import { isError } from "./isError"

export const isErrorResponse = (x: unknown, faultCollector?: ValidationFaultCollector): x is ErrorResponse =>
    isData(x, faultCollector) && isArray(isError)((x as ErrorResponse).errors, faultCollector?.sub("errors"))

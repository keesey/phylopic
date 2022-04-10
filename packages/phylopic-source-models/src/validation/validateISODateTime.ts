import { ISODateTime } from "../models/ISODateTime"

export const validateISODateTime = (value: ISODateTime) => {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        throw new Error(`Not a valid ISO Date-time: ${value}.`)
    }
    const parts = value.split(/\D+/g).map(part => parseInt(part, 10))
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]))
    if (date.toISOString() !== value) {
        throw new Error("Not a valid date-time")
    }
}

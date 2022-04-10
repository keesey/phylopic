import { ValidationFault } from "./ValidationFault"
export const validateISOTimestamp = (value: unknown, field: string): readonly ValidationFault[] => {
    if (typeof value !== "string") {
        return [
            {
                field,
                message: `Expected an ISO timestamp string: ${value}.`,
            },
        ]
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return [
            {
                field,
                message: `Not a valid ISO timestamp: "${value}". Required format is: "YYYY-MM-DDTHH:MM:SS.sssZ".`,
            },
        ]
    }
    if (isNaN(new Date(value).valueOf())) {
        return [
            {
                field,
                message: `Not a valid timestamp: "${value}".`,
            },
        ]
    }
    return []
}
export default validateISOTimestamp

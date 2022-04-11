import { ErrorType } from "~/types/Error"
export const ERROR_TYPES: ReadonlySet<ErrorType> = new Set([
    "ACCESS_DENIED",
    "API_CONFIGURATION_ERROR",
    "AUTHORIZER_FAILURE",
    "AUTHORIZER_CONFIGURATION_ERROR",
    "BAD_REQUEST_PARAMETERS",
    "BAD_REQUEST_BODY",
    "DEFAULT_4XX",
    "DEFAULT_5XX",
    "EXPIRED_TOKEN",
    "INVALID_SIGNATURE",
    "INTEGRATION_FAILURE",
    "INTEGRATION_TIMEOUT",
    "INVALID_API_KEY",
    "MISSING_AUTHENTICATION_TOKEN",
    "QUOTA_EXCEEDED",
    "REQUEST_TOO_LARGE",
    "RESOURCE_NOT_FOUND",
    "THROTTLED",
    "UNAUTHORIZED",
    "UNSUPPORTED_MEDIA_TYPE",
])
export default ERROR_TYPES

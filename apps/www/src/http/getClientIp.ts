const getClientIp = (forwardedFor: string | string[] | undefined): string => {
    const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
    return value?.split(",")[0]?.trim() || "unknown"
}

export default getClientIp

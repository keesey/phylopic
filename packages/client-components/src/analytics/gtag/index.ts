export type GTagConsentInfo = Partial<{
    ad_storage: "granted" | "denied"
    analytics_storage: "granted" | "denied"
    wait_for_update: number
}>
export type GTagInfo = Record<string, string | number | boolean | null | undefined>
const CONSOLE_ID = "[GTAG]"
declare const window: Window &
    Partial<{
        gtag(command: "config", targetId: string, additionalConfigInfo: GTagInfo): void
        gtag(command: "consent", info: GTagConsentInfo): void
        gtag(command: "event", eventName: string, eventParams: GTagInfo): void
        gtag(
            command: "get",
            targetId: string,
            fieldName: "client_id" | "session_id" | string,
            callback?: (value: string) => void,
        ): void
        gtag(command: "set", params: GTagInfo): void
    }>
const config = (targetId: string, additionalConfigInfo: GTagInfo) => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        window.gtag?.("config", targetId, additionalConfigInfo)
    } else {
        console.info(CONSOLE_ID, "config", targetId, additionalConfigInfo)
    }
}
const consent = (info: GTagConsentInfo) => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        window.gtag?.("consent", info)
    } else {
        console.info(CONSOLE_ID, "consent", info)
    }
}
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
const event = (action: string, options?: GTagInfo) => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        window.gtag?.("event", action, options ?? {})
    } else {
        console.info(CONSOLE_ID, "event", action, options)
    }
}
const get = (targetId: string, fieldName: "client_id" | "session_id" | string, callback?: (value: string) => void) => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        window.gtag?.("get", targetId, fieldName, callback)
    } else {
        console.info(CONSOLE_ID, "get", targetId, fieldName, callback)
    }
}
const set = (params: GTagInfo) => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        window.gtag?.("set", params)
    } else {
        console.info(CONSOLE_ID, "set", params)
    }
}
export const gtag = {
    config,
    consent,
    event,
    get,
    set,
}

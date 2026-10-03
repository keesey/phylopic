import type { LicenseFilters } from "./types.js"

export const imageMatchesLicenseFilters = (licenseHref: string | undefined, filters: LicenseFilters): boolean => {
    if (!licenseHref) {
        return false
    }
    const lower = licenseHref.toLowerCase()
    const isPublicDomain = lower.includes("publicdomain") || lower.includes("/zero/")
    const hasNc = lower.includes("noncommercial") || /\/nc(\/|$|-)/.test(lower)
    const hasSa = lower.includes("by-sa")
    const hasBy = lower.includes("/by/") && !isPublicDomain

    if (filters.filter_license_nc === "false" && hasNc) {
        return false
    }
    if (filters.filter_license_sa === "false" && hasSa) {
        return false
    }
    if (filters.filter_license_by === "false" && hasBy) {
        return false
    }
    return true
}

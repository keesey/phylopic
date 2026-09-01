import { FUNDRAISER_MONTHS_UTC } from "./constants"

export type CampaignId = `${number}-${"05" | "10"}`

const CAMPAIGN_ID_PATTERN = /^(\d{4})-(05|10)$/

export const isCampaignId = (value: string): value is CampaignId => CAMPAIGN_ID_PATTERN.test(value)

export const isFundraiserMonthUtc = (month: number): boolean =>
    (FUNDRAISER_MONTHS_UTC as readonly number[]).includes(month)

export const campaignIdFromDate = (date: Date): CampaignId | null => {
    const month = date.getUTCMonth()
    if (!isFundraiserMonthUtc(month)) {
        return null
    }
    const year = date.getUTCFullYear()
    return `${year}-${month === 4 ? "05" : "10"}`
}

export const getPreviousCampaignId = (campaignId: CampaignId): CampaignId | null => {
    const match = CAMPAIGN_ID_PATTERN.exec(campaignId)
    if (!match) {
        return null
    }
    const year = Number.parseInt(match[1]!, 10)
    const month = match[2]!
    if (month === "10") {
        return `${year}-05`
    }
    return `${year - 1}-10`
}

export const getNextCampaignId = (campaignId: CampaignId): CampaignId => {
    const match = CAMPAIGN_ID_PATTERN.exec(campaignId)
    if (!match) {
        throw new Error(`Invalid campaign id: ${campaignId}`)
    }
    const year = Number.parseInt(match[1]!, 10)
    const month = match[2]!
    if (month === "05") {
        return `${year}-10`
    }
    return `${year + 1}-05`
}

/** Next May or October strictly after `now` (not the active month when in a window). */
export const getUpcomingCampaignId = (now = new Date()): CampaignId => {
    const month = now.getUTCMonth()
    const year = now.getUTCFullYear()
    if (month < 4) {
        return `${year}-05`
    }
    if (month < 9) {
        return `${year}-10`
    }
    return `${year + 1}-05`
}

/** Active campaign (if any) and the following window — for the edit campaign picker. */
export const getSelectableCampaignIds = (now = new Date()): CampaignId[] => {
    const active = campaignIdFromDate(now)
    if (active) {
        return [active, getNextCampaignId(active)]
    }
    return [getUpcomingCampaignId(now)]
}

export const isFundraiserPreviewEnabled = (): boolean => process.env.NEXT_PUBLIC_FUNDRAISER_PREVIEW === "true"

export const isFundraiserBannerActive = (now = new Date()): boolean =>
    isFundraiserPreviewEnabled() || campaignIdFromDate(now) !== null

/** Campaign to show on the public site (active window, or next when previewing). */
export const getPublicCampaignId = (now = new Date()): CampaignId | null => {
    const active = campaignIdFromDate(now)
    if (active) {
        return active
    }
    if (isFundraiserPreviewEnabled()) {
        return getUpcomingCampaignId(now)
    }
    return null
}

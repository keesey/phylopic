import type { CampaignId } from "./campaign"

export const hashKey = (campaignId: CampaignId): string => `fundraiser:${campaignId}`

export const seenKey = (campaignId: CampaignId): string => `fundraiser:${campaignId}:seen`

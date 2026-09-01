import {
    campaignIdFromDate,
    getPreviousCampaignId,
    getPublicCampaignId,
    getSelectableCampaignIds,
    isFundraiserBannerActive,
    type CampaignId,
} from "./campaign"
import { CURRENCY, DEFAULT_GOAL_CENTS } from "./constants"
import { getReadKv, getWriteKv, isKvReadConfigured } from "./kv"
import { hashKey, seenKey } from "./keys"
import type { CampaignEditorState, CampaignHash, FundraiserStatus } from "./types"

const parseIntField = (value: unknown): number => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.trunc(value)
    }
    if (typeof value === "string" && value.length) {
        const parsed = Number.parseInt(value, 10)
        if (Number.isFinite(parsed)) {
            return parsed
        }
    }
    return 0
}

const readHash = async (campaignId: CampaignId): Promise<CampaignHash | null> => {
    const raw = await getReadKv().hgetall<Record<string, unknown>>(hashKey(campaignId))
    if (!raw || Object.keys(raw).length === 0) {
        return null
    }
    return {
        donation: parseIntField(raw.donation),
        goal: parseIntField(raw.goal),
        manual: parseIntField(raw.manual),
    }
}

const resolveInheritedGoalCents = async (campaignId: CampaignId): Promise<number> => {
    const previous = getPreviousCampaignId(campaignId)
    if (!previous) {
        return DEFAULT_GOAL_CENTS
    }
    const previousHash = await readHash(previous)
    if (!previousHash) {
        return DEFAULT_GOAL_CENTS
    }
    return previousHash.goal || DEFAULT_GOAL_CENTS
}

export const ensureCampaign = async (campaignId: CampaignId): Promise<CampaignHash> => {
    const existing = await readHash(campaignId)
    if (existing) {
        return existing
    }
    const goal = await resolveInheritedGoalCents(campaignId)
    const created: CampaignHash = { donation: 0, goal, manual: 0 }
    await getWriteKv().hset(hashKey(campaignId), created)
    return created
}

export const getCampaignHash = async (campaignId: CampaignId): Promise<CampaignHash> => ensureCampaign(campaignId)

export const getFundraiserStatus = async (now = new Date()): Promise<FundraiserStatus | null> => {
    if (!isKvReadConfigured()) {
        return null
    }
    const campaign = getPublicCampaignId(now)
    if (!campaign) {
        return {
            active: false,
            campaign: null,
            currency: CURRENCY,
            goalCents: 0,
            raisedCents: 0,
        }
    }
    const existing = await readHash(campaign)
    const inheritedGoalCents = await resolveInheritedGoalCents(campaign)
    const hash = existing ?? { donation: 0, goal: inheritedGoalCents, manual: 0 }
    return {
        active: isFundraiserBannerActive(now),
        campaign,
        currency: CURRENCY,
        goalCents: hash.goal,
        raisedCents: hash.donation + hash.manual,
    }
}

export const getCampaignEditorState = async (
    campaignId: CampaignId,
    now = new Date(),
): Promise<CampaignEditorState | null> => {
    if (!isKvReadConfigured()) {
        return null
    }
    const campaigns = getSelectableCampaignIds(now)
    const existing = await readHash(campaignId)
    const inheritedGoalCents = await resolveInheritedGoalCents(campaignId)
    const hash = existing ?? { donation: 0, goal: inheritedGoalCents, manual: 0 }
    return {
        campaign: campaignId,
        campaigns,
        currency: CURRENCY,
        donationCents: hash.donation,
        exists: existing !== null,
        goalCents: hash.goal,
        inheritedGoalCents,
        manualCents: hash.manual,
        raisedCents: hash.donation + hash.manual,
    }
}

export const setCampaignGoal = async (campaignId: CampaignId, goalCents: number): Promise<CampaignHash> => {
    if (!Number.isInteger(goalCents) || goalCents < 0) {
        throw new Error("goalCents must be a non-negative integer.")
    }
    await ensureCampaign(campaignId)
    await getWriteKv().hset(hashKey(campaignId), { goal: goalCents })
    return getCampaignHash(campaignId)
}

export const setCampaignManual = async (campaignId: CampaignId, manualCents: number): Promise<CampaignHash> => {
    if (!Number.isInteger(manualCents) || manualCents < 0) {
        throw new Error("manualCents must be a non-negative integer.")
    }
    await ensureCampaign(campaignId)
    await getWriteKv().hset(hashKey(campaignId), { manual: manualCents })
    return getCampaignHash(campaignId)
}

export const recordDonation = async (campaignId: CampaignId, txnId: string, amountCents: number): Promise<boolean> => {
    if (!txnId || amountCents <= 0) {
        return false
    }
    await ensureCampaign(campaignId)
    const added = await getWriteKv().sadd(seenKey(campaignId), txnId)
    if (added === 0) {
        return false
    }
    await getWriteKv().hincrby(hashKey(campaignId), "donation", amountCents)
    return true
}

export const dollarsToCents = (amount: string): number => {
    const value = Number.parseFloat(amount)
    if (!Number.isFinite(value) || value <= 0) {
        return 0
    }
    return Math.round(value * 100)
}

export const campaignIdFromPaymentDate = (paymentDate: string): CampaignId | null => {
    const parsed = Date.parse(paymentDate)
    if (!Number.isFinite(parsed)) {
        return null
    }
    return campaignIdFromDate(new Date(parsed))
}

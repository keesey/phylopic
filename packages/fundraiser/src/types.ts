import type { CampaignId } from "./campaign"

export type FundraiserStatus = Readonly<{
    active: boolean
    campaign: CampaignId | null
    currency: string
    goalCents: number
    raisedCents: number
}>

export type CampaignEditorState = Readonly<{
    campaign: CampaignId
    campaigns: readonly CampaignId[]
    currency: string
    donationCents: number
    exists: boolean
    goalCents: number
    inheritedGoalCents: number
    manualCents: number
    raisedCents: number
}>

export type CampaignHash = Readonly<{
    donation: number
    goal: number
    manual: number
}>

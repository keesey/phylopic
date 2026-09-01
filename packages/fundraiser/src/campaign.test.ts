import { describe, expect, it } from "vitest"
import {
    campaignIdFromDate,
    getNextCampaignId,
    getPreviousCampaignId,
    getPublicCampaignId,
    getSelectableCampaignIds,
    getUpcomingCampaignId,
} from "./campaign"

describe("campaignIdFromDate", () => {
    it("returns May and October ids", () => {
        expect(campaignIdFromDate(new Date("2026-05-01T00:00:00Z"))).toBe("2026-05")
        expect(campaignIdFromDate(new Date("2026-10-15T12:00:00Z"))).toBe("2026-10")
    })

    it("returns null outside fundraiser months", () => {
        expect(campaignIdFromDate(new Date("2026-09-01T00:00:00Z"))).toBeNull()
    })
})

describe("getPreviousCampaignId", () => {
    it("walks May/October backward", () => {
        expect(getPreviousCampaignId("2026-10")).toBe("2026-05")
        expect(getPreviousCampaignId("2027-05")).toBe("2026-10")
        expect(getPreviousCampaignId("2026-05")).toBe("2025-10")
    })
})

describe("getNextCampaignId", () => {
    it("walks May/October forward", () => {
        expect(getNextCampaignId("2026-05")).toBe("2026-10")
        expect(getNextCampaignId("2026-10")).toBe("2027-05")
    })
})

describe("getUpcomingCampaignId", () => {
    it("picks the next window", () => {
        expect(getUpcomingCampaignId(new Date("2026-01-01T00:00:00Z"))).toBe("2026-05")
        expect(getUpcomingCampaignId(new Date("2026-06-01T00:00:00Z"))).toBe("2026-10")
        expect(getUpcomingCampaignId(new Date("2026-11-01T00:00:00Z"))).toBe("2027-05")
    })
})

describe("getSelectableCampaignIds", () => {
    it("includes active and next during a window", () => {
        expect(getSelectableCampaignIds(new Date("2026-05-02T00:00:00Z"))).toEqual(["2026-05", "2026-10"])
    })
})

describe("getPublicCampaignId", () => {
    it("returns null outside a window without preview", () => {
        const previous = process.env.NEXT_PUBLIC_FUNDRAISER_PREVIEW
        delete process.env.NEXT_PUBLIC_FUNDRAISER_PREVIEW
        expect(getPublicCampaignId(new Date("2026-09-01T00:00:00Z"))).toBeNull()
        process.env.NEXT_PUBLIC_FUNDRAISER_PREVIEW = previous
    })
})

import {
    getCampaignEditorState,
    getSelectableCampaignIds,
    isCampaignId,
    isKvReadConfigured,
    isKvWriteConfigured,
    setCampaignGoal,
    setCampaignManual,
    type CampaignEditorState,
    type CampaignId,
} from "@phylopic/fundraiser"
import type { NextApiHandler } from "next"

const readCampaignQuery = (value: string | string[] | undefined): CampaignId | null => {
    const raw = Array.isArray(value) ? value[0] : value
    if (!raw || !isCampaignId(raw)) {
        return null
    }
    return raw
}

const index: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        if (!isKvReadConfigured()) {
            res.status(503).json({ error: "Fundraiser storage is not configured." })
            return
        }
    } else if (req.method === "PATCH") {
        if (!isKvWriteConfigured()) {
            res.status(503).json({ error: "Fundraiser write storage is not configured." })
            return
        }
    } else {
        res.setHeader("Allow", "GET, PATCH")
        res.status(405).json({ error: "Method not allowed." })
        return
    }
    if (req.method === "GET") {
        try {
            const requested = readCampaignQuery(req.query.campaign)
            const campaign = requested ?? getSelectableCampaignIds()[0]!
            const state = await getCampaignEditorState(campaign)
            if (!state) {
                res.status(503).json({ error: "Fundraiser storage is not configured." })
                return
            }
            res.status(200).json(state satisfies CampaignEditorState)
        } catch (error) {
            console.error("[GET /api/fundraiser]", error)
            res.status(502).json({ error: "Could not load fundraiser campaign." })
        }
        return
    }
    if (req.method === "PATCH") {
        try {
            const body = (typeof req.body === "object" && req.body !== null ? req.body : {}) as {
                campaign?: unknown
                goalCents?: unknown
                manualCents?: unknown
            }
            if (typeof body.campaign !== "string" || !isCampaignId(body.campaign)) {
                res.status(400).json({ error: "Invalid campaign." })
                return
            }
            if (body.goalCents !== undefined) {
                if (typeof body.goalCents !== "number" || !Number.isInteger(body.goalCents) || body.goalCents < 0) {
                    res.status(400).json({ error: "Invalid goalCents." })
                    return
                }
                await setCampaignGoal(body.campaign, body.goalCents)
            }
            if (body.manualCents !== undefined) {
                if (
                    typeof body.manualCents !== "number" ||
                    !Number.isInteger(body.manualCents) ||
                    body.manualCents < 0
                ) {
                    res.status(400).json({ error: "Invalid manualCents." })
                    return
                }
                await setCampaignManual(body.campaign, body.manualCents)
            }
            const state = await getCampaignEditorState(body.campaign)
            if (!state) {
                res.status(503).json({ error: "Fundraiser storage is not configured." })
                return
            }
            res.status(200).json(state satisfies CampaignEditorState)
        } catch (error) {
            console.error("[PATCH /api/fundraiser]", error)
            res.status(502).json({ error: "Could not update fundraiser campaign." })
        }
        return
    }
}

export default index

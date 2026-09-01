import {
    campaignIdFromDate,
    campaignIdFromPaymentDate,
    dollarsToCents,
    isCompletedDonation,
    isKvWriteConfigured,
    normalizeIpnBody,
    recordDonation,
    verifyPayPalIpn,
} from "@phylopic/fundraiser"
import type { NextApiHandler } from "next"

const index: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST")
        res.status(405).end()
        return
    }
    if (!isKvWriteConfigured()) {
        res.status(503).end()
        return
    }
    try {
        const fields = normalizeIpnBody(req.body)
        const verified = await verifyPayPalIpn(fields)
        if (!verified) {
            console.warn("[POST /api/fundraiser/paypal] IPN verification failed.")
            res.status(400).end()
            return
        }
        if (!isCompletedDonation(fields)) {
            res.status(200).end()
            return
        }
        const txnId = fields.txn_id
        const amountCents = dollarsToCents(fields.mc_gross ?? "")
        const campaignId =
            (fields.payment_date && campaignIdFromPaymentDate(fields.payment_date)) || campaignIdFromDate(new Date())
        if (!campaignId || !txnId || amountCents <= 0) {
            res.status(200).end()
            return
        }
        await recordDonation(campaignId, txnId, amountCents)
        res.status(200).end()
    } catch (error) {
        console.error("[POST /api/fundraiser/paypal]", error)
        res.status(500).end()
    }
}

export default index

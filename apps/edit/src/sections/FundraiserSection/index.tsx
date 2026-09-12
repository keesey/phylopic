import type { CampaignEditorState, CampaignId } from "@phylopic/fundraiser"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import useSWR from "swr"

const fetcher = async (url: string): Promise<CampaignEditorState> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Could not load fundraiser campaign.")
    }
    return response.json() as Promise<CampaignEditorState>
}

const formatDollars = (cents: number): string =>
    (cents / 100).toLocaleString("en-US", {
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        style: "currency",
    })

const FundraiserSection: FC = () => {
    const [campaign, setCampaign] = useState<CampaignId | null>(null)
    const query = campaign ? `/api/fundraiser?campaign=${encodeURIComponent(campaign)}` : "/api/fundraiser"
    const { data, error, mutate } = useSWR(query, fetcher)
    const [goalDollars, setGoalDollars] = useState("")
    const [manualDollars, setManualDollars] = useState("")
    const [message, setMessage] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const syncedCampaign = useRef<CampaignId | null>(null)

    useEffect(() => {
        if (data && campaign === null) {
            setCampaign(data.campaign)
        }
    }, [campaign, data])

    useEffect(() => {
        if (!data || syncedCampaign.current === data.campaign) {
            return
        }
        syncedCampaign.current = data.campaign
        setGoalDollars((data.goalCents / 100).toString())
        setManualDollars((data.manualCents / 100).toString())
    }, [data])

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (!data) {
            return
        }
        setSaving(true)
        setMessage(null)
        try {
            const goalCents = Math.round(Number.parseFloat(goalDollars) * 100)
            const manualCents = Math.round(Number.parseFloat(manualDollars || "0") * 100)
            if (!Number.isFinite(goalCents) || goalCents < 0) {
                throw new Error("Enter a valid goal amount.")
            }
            if (!Number.isFinite(manualCents) || manualCents < 0) {
                throw new Error("Enter a valid manual offset.")
            }
            const response = await fetch("/api/fundraiser", {
                body: JSON.stringify({
                    campaign: data.campaign,
                    goalCents,
                    manualCents,
                }),
                headers: { "Content-Type": "application/json" },
                method: "PATCH",
            })
            if (!response.ok) {
                throw new Error("Save failed.")
            }
            const updated = (await response.json()) as CampaignEditorState
            await mutate(updated, false)
            setMessage("Saved.")
        } catch (saveError) {
            setMessage(saveError instanceof Error ? saveError.message : "Save failed.")
        } finally {
            setSaving(false)
        }
    }

    if (error) {
        return (
            <section>
                <h2>Fundraiser</h2>
                <p>Fundraiser storage is not configured.</p>
            </section>
        )
    }

    if (!data) {
        return (
            <section>
                <h2>Fundraiser</h2>
                <p>Loading…</p>
            </section>
        )
    }

    return (
        <section>
            <h2>Fundraiser</h2>
            <form onSubmit={onSubmit}>
                <p>
                    <label htmlFor="fundraiser-campaign">
                        Campaign{" "}
                        <select
                            id="fundraiser-campaign"
                            onChange={event => {
                                syncedCampaign.current = null
                                setCampaign(event.target.value as CampaignId)
                                setMessage(null)
                            }}
                            value={data.campaign}
                        >
                            {data.campaigns.map(id => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                    </label>
                </p>
                <p>
                    Collected so far: {formatDollars(data.raisedCents)} (PayPal {formatDollars(data.donationCents)}
                    {data.manualCents > 0 && <> + manual {formatDollars(data.manualCents)}</>})
                    {!data.exists && <> — inherited goal {formatDollars(data.inheritedGoalCents)}</>}
                </p>
                <p>
                    <label htmlFor="fundraiser-goal">
                        Goal (USD){" "}
                        <input
                            id="fundraiser-goal"
                            min={0}
                            onChange={event => setGoalDollars(event.target.value)}
                            step="1"
                            type="number"
                            value={goalDollars}
                        />
                    </label>
                </p>
                <p>
                    <label htmlFor="fundraiser-manual">
                        Manual offset (USD){" "}
                        <input
                            id="fundraiser-manual"
                            min={0}
                            onChange={event => setManualDollars(event.target.value)}
                            step="1"
                            type="number"
                            value={manualDollars}
                        />
                    </label>
                </p>
                <p>
                    <button disabled={saving} type="submit">
                        {saving ? "Saving…" : "Save"}
                    </button>
                </p>
                {message && <p>{message}</p>}
            </form>
        </section>
    )
}

export default FundraiserSection

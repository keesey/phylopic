import { Contribution, isContribution } from "@phylopic/source-models"
import { isEmailAddress, isUUID, URL, UUID, ValidationFaultCollector } from "@phylopic/utils"
import axios from "axios"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "~/auth/AuthContext"
import useAuthorized from "~/auth/hooks/useAuthorized"
import { JWT } from "~/auth/JWT"
import { WorkingSubmission } from "../WorkingSubmission"
import useSWR from "swr"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
interface Props {
    onComplete?: () => void
    submission: WorkingSubmission
    uuid: UUID
}
type PutSWRKey = [URL, Contribution, JWT]
const fetcher = async ([url, contribution, token]: PutSWRKey) => {
    await axios.put(url, contribution, {
        headers: { authorization: `Bearer ${token}` }
    })
    return contribution
}
const Finalize: FC<Props> = ({ onComplete, submission, uuid }) => {
    const authorized = useAuthorized()
    const emailAddress = useEmailAddress()
    const [token] = useContext(AuthContext) ?? []
    const [putKey, setPutKey] = useState<PutSWRKey | null>()
    const { data, error, isValidating } = useSWR(putKey, fetcher)
    const handleClick = useCallback(() => {
        if (!isEmailAddress(emailAddress) || !isUUID(uuid) || typeof token !== "string") {
            setPutKey(null)
        } else {
            const contribution = {
                ...submission,
                attribution: submission.attribution || null,
                general: submission.general ?? null,
                contributor: emailAddress,
                created: new Date().toISOString(),
                uuid,
            }
            console.debug("LICENSE", contribution.license)
            const collector = new ValidationFaultCollector()
            if (!isContribution(contribution, collector)) {
                alert(collector.list().map(fault => `${fault.field}: ${fault.message}`))
                setPutKey(null)
            } else {
                setPutKey([
                    `/api/images/${encodeURIComponent(uuid)}`,
                    contribution,
                    token,
                ])
            }
        }
    }, [emailAddress, submission, token, uuid])
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    useEffect(() => {
        if (isContribution(data) && onComplete) {
            onComplete()
        }
    }, [data, onComplete])
    return (
        <section id="finalize">
            <p>Does everything look good?</p>
            <button className="cta" disabled={!authorized || isValidating} onClick={handleClick}>Upload!</button>
        </section>
    )
}
export default Finalize

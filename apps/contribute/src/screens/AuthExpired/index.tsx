import { ContributorContainer } from "@phylopic/ui"
import { EmailAddress } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useContributor from "~/profile/useContributor"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import TTLSelector from "~/ui/TTLSelector"
import { TTL } from "~/ui/TTLSelector/TTL"
import styles from "./index.module.scss"
import useContributorUUID from "~/profile/useContributorUUID"
export interface Props {
    onSubmit?: (email: EmailAddress | null, ttl?: number) => void
}
const DAY = 24 * 60 * 60 * 1000
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const QUARTER = 3 * MONTH
const YEAR = 365 * DAY
const TTL_VALUES = {
    DAY,
    WEEK,
    MONTH,
    QUARTER,
    YEAR,
}
const AuthExpired: FC<Props> = ({ onSubmit }) => {
    const [ttl, setTTL] = useState<TTL>("DAY")
    const uuid = useContributorUUID()
    const contributor = useContributor()
    const handleClearClick = useCallback(() => {
        onSubmit?.(null)
    }, [onSubmit])
    const handleReauthorizeClick = useCallback(() => {
        if (contributor?.emailAddress) {
            onSubmit?.(contributor?.emailAddress, TTL_VALUES[ttl] ?? DAY)
        }
    }, [contributor?.emailAddress, onSubmit, ttl])
    return (
        <DialogueScreen>
            {uuid && (
                <ContributorContainer uuid={uuid}>
                    {contributor => <p>Welcome back{contributor?.name && `, ${contributor.name}`}!</p>}
                </ContributorContainer>
            )}
            {!uuid && <p>Welcome back!</p>}
            <p>
                Your authorization has expired.{" "}
                {contributor?.emailAddress ? (
                    <>
                        Please click below to send another authorization email to <em>{contributor.emailAddress}</em>.
                    </>
                ) : (
                    "Loading email address…"
                )}
            </p>
            {contributor?.emailAddress && (
                <>
                    <div className={styles.field}>
                        <label>
                            Authorize this device for <TTLSelector onChange={setTTL} value={ttl} />.
                        </label>
                        <br />
                        <small>(You may log out at any time.)</small>
                    </div>
                    <button className="cta" onClick={handleReauthorizeClick}>
                        Send Authorization
                    </button>
                    <p>
                        <a className="text" onClick={handleClearClick}>
                            Wait, that isn't my email address!
                        </a>
                    </p>
                </>
            )}
        </DialogueScreen>
    )
}
export default AuthExpired

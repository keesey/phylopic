import { Loader } from "@phylopic/client-components"
import { EmailAddress } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useContributor from "~/profile/useContributor"
import useContributorUUID from "~/profile/useContributorUUID"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import TTLSelector from "~/ui/TTLSelector"
import { TTL } from "~/ui/TTLSelector/TTL"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import styles from "./index.module.scss"
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
        <Dialogue>
            <Speech mode="system">
                <p>Welcome back{contributor?.name && `, ${contributor.name}`}!</p>
            </Speech>
            <Speech mode="system">
                <p>
                    Your authorization has expired.{" "}
                    {contributor?.emailAddress ? (
                        <>
                            Please click below to send another authorization email to{" "}
                            <em>{contributor.emailAddress}</em>.
                        </>
                    ) : (
                        <>Loading email address&hellip;</>
                    )}
                </p>
                {!contributor?.emailAddress && <Loader />}
            </Speech>
            {contributor?.emailAddress && (
                <>
                    <Speech mode="user">
                        <div className={styles.field}>
                            <label>
                                Authorize this device for <TTLSelector onChange={setTTL} value={ttl} />.
                            </label>
                        </div>
                    </Speech>
                    <Speech mode="system">
                        <small>(You may log out at any time.)</small>
                    </Speech>
                    <UserOptions>
                        <UserButton onClick={handleReauthorizeClick}>Send authorization.</UserButton>
                        <UserButton onClick={handleClearClick}>Wait, that isn&rsquo;lt my email address!</UserButton>
                    </UserOptions>
                </>
            )}
        </Dialogue>
    )
}
export default AuthExpired

import axios from "axios"
import clsx from "clsx"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "~/auth/AuthContext"
import usePayload from "~/auth/hooks/usePayload"
import decodeJWT from "~/auth/jwt/decodeJWT"
import { TTLPayload } from "~/auth/ttl/TTLPayload"
import TTLSelector from "../TTLSelector"
import { TTL } from "../TTLSelector/TTL"
import { TTL_VALUES } from "../TTLSelector/TTL_VALUES"
import styles from "./index.module.scss"
const MAXIMUM_TTL = 12 * 60 * 60 * 1000
const AuthExpirationCountdown: FC = () => {
    const [dismissed, setDismissed] = useState(false)
    const [pending, setPending] = useState(false)
    const [token, setToken] = useContext(AuthContext) ?? []
    const [now, setNow] = useState(() => new Date().valueOf())
    useEffect(() => {
        const handle = setInterval(() => setNow(new Date().valueOf()), 1000)
        return () => clearInterval(handle)
    }, [])
    const payload = usePayload()
    const [newTTL, setNewTTL] = useState<TTL>("DAY")
    useEffect(() => {
        if (payload?.exp && payload.iat) {
            const value = (payload.exp - payload.iat) * 1000
            const diff = (a: number) => Math.abs(a - value)
            setNewTTL(Object.entries(TTL_VALUES).sort(([, a], [, b]) => diff(a) - diff(b))[0][0] as TTL)
        }
    }, [payload?.exp, payload?.iat])
    const reauthorize = useCallback(async () => {
        setPending(true)
        try {
            const response = await axios.post<string>(`/api/reauthorize`, { ttl: TTL_VALUES[newTTL] } as TTLPayload, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            if (!decodeJWT(response.data)) {
                throw new Error("Invalid response from server.")
            }
            setToken?.(response.data)
            setDismissed(true)
        } catch (e) {
            alert(e)
        } finally {
            setPending(false)
        }
    }, [newTTL, token])
    if (dismissed || !token || typeof payload?.exp !== "number" || !isFinite(payload.exp)) {
        return null
    }
    const ttl = payload.exp * 1000 - now
    if (ttl <= 0 || ttl > MAXIMUM_TTL) {
        return null
    }
    return (
        <div className={styles.main}>
            <span>
                You have <Duration value={ttl} /> before your authorization expires.{" "}
                <a className={clsx(styles.link, pending && styles.pending)} onClick={reauthorize}>
                    Click here to renew
                </a>{" "}
                for <TTLSelector disabled={pending} mode="light" value={newTTL} onChange={setNewTTL} />.
            </span>
            <a className={clsx(styles.close, pending && styles.pending)} onClick={() => setDismissed(true)}>
                ×
            </a>
        </div>
    )
}
export default AuthExpirationCountdown
const Duration: FC<{ value: number }> = ({ value }) => {
    if (value > 60 * 60 * 1000) {
        const hours = Math.floor(value / (60 * 60 * 1000))
        return (
            <>
                {hours} hour{hours === 1 ? "" : "s"}
            </>
        )
    }
    if (value > 60 * 1000) {
        const minutes = Math.floor(value / (60 * 1000))
        return (
            <>
                {minutes} minute{minutes === 1 ? "" : "s"}
            </>
        )
    }
    {
        const seconds = Math.floor(value / 1000)
        return (
            <>
                {seconds} second{seconds === 1 ? "" : "s"}
            </>
        )
    }
}

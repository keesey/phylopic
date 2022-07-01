import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import EmailForm from "./EmailForm"
import ReauthorizeForm from "./ReauthorizeForm"
import useSWR from "swr"
import axios from "axios"
import { Loader } from "@phylopic/ui"
import { setRequestMeta } from "next/dist/server/request-meta"
const fetchPost = async (key: { body: unknown; url: string }) => {
    await axios.post(key.url, key.body, {
        headers: { "content-type": "application/json" },
        responseType: "json",
    })
    return true
}
const Registration: FC = () => {
    const authorized = useAuthorized()
    const authEmailAddress = useEmailAddress()
    const router = useRouter()
    const [emailAddress, setEmailAddress] = useState<EmailAddress | null>(authEmailAddress)
    const [ttl, setTTL] = useState(24 * 60 * 60 * 1000)
    const [sendRequested, setSendRequested] = useState(false)
    const handleSubmit = useCallback((newEmail: EmailAddress | null, newTTL?: number) => {
        setEmailAddress(newEmail)
        if (newTTL) {
            setTTL(newTTL)
        }
        setSendRequested(isEmailAddress(newEmail))
    }, [])
    const authorizeKey = useMemo(() => {
        if (sendRequested && isEmailAddress(emailAddress)) {
            return { url: `/api/authorize/${encodeURIComponent(emailAddress)}`, body: { ttl } }
        }
        return null
    }, [])
    const swr = useSWR(authEmailAddress, fetchPost)
    useEffect(() => {
        if (authorized) {
            router.push("/submissions")
        } else if (swr.data) {
            router.push("/checkemail")
        }
    }, [authorized, router, swr.data])
    if (!swr.data && swr.isValidating) {
        return <Loader />
    }
    if (swr.error) {
        // :TODO: Error Message Component
        return <p>{String(swr.error)}</p>
    }
    if (authorized || emailAddress || swr.data) {
        return null
    }
    if (authEmailAddress) {
        return (
            <section>
                <p>Welcome back!</p>
                <p>
                    Your registration has expired. Please click below to send another authorization email to{" "}
                    <em>{authEmailAddress}</em>.
                </p>
                <ReauthorizeForm onSubmit={handleSubmit} />
            </section>
        )
    }
    return (
        <section>
            <p>Ready to upload some silhouette images? Great, let&apos;s get started!</p>
            <p>Please enter your email address:</p>
            <EmailForm onSubmit={handleSubmit} />
        </section>
    )
}
export default Registration

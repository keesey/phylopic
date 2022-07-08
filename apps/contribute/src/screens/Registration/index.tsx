import { AnchorLink, ContributorContainer, Loader } from "@phylopic/ui"
import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import EmailForm from "./EmailForm"
import ReauthorizeForm from "./ReauthorizeForm"
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
        if (!authorized && sendRequested && isEmailAddress(emailAddress)) {
            return { url: `/api/authorize/${encodeURIComponent(emailAddress)}`, body: { ttl } }
        }
        return null
    }, [authorized, emailAddress, sendRequested, ttl])
    const swr = useSWR(authorizeKey, fetchPost)
    const uuid = useContributorUUID()
    useEffect(() => {
        if (authorized) {
            router.push("/submissions")
        } else if (swr.data) {
            router.push("/checkemail")
        }
    }, [authorized, router, swr.data])
    if (authorized) {
        return (
            <section className="dialogue">
                {uuid && (
                    <ContributorContainer uuid={uuid}>
                        {contributor => (contributor ? <p>Hi, {contributor.name}!</p> : null)}
                    </ContributorContainer>
                )}
                <AnchorLink className="cta" href="/submissions">
                    Let's get started!
                </AnchorLink>
            </section>
        )
    }
    if (!swr.data && swr.isValidating) {
        return <Loader />
    }
    if (swr.error) {
        // :TODO: Error Message Component
        return <p>{String(swr.error)}</p>
    }
    if (authEmailAddress) {
        return (
            <section className="dialogue">
                <p>
                    Welcome back
                    {uuid && (
                        <ContributorContainer uuid={uuid}>
                            {contributor => (contributor ? `, ${contributor.name}` : null)}
                        </ContributorContainer>
                    )}
                    !
                </p>
                <p>
                    Your registration has expired. Please click below to send another authorization email to{" "}
                    <em>{authEmailAddress}</em>.
                </p>
                <ReauthorizeForm onSubmit={handleSubmit} />
            </section>
        )
    }
    return (
        <section className="dialogue">
            <p>Ready to upload some silhouette images? Great, let&apos;s get started!</p>
            <p>Please enter your email address:</p>
            <EmailForm onSubmit={handleSubmit} />
        </section>
    )
}
export default Registration

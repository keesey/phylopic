import { Contributor } from "@phylopic/api-models"
import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import axios from "axios"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import AuthContext from "~/auth/AuthContext"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useExpired from "~/auth/hooks/useExpired"
import useContributorMutator from "~/s3/swr/useContributorMutator"
import useContributorSWR from "~/s3/swr/useContributorSWR"
import AccountDetails from "~/screens/AccountDetails"
import { DAY } from "~/ui/TTLSelector/TTL_VALUES"
const LoadingState = dynamic(() => import("~/screens/LoadingState"), { ssr: false })
const SignIn = dynamic(() => import("~/screens/SignIn"), { ssr: false })
const AuthExpired = dynamic(() => import("~/screens/AuthExpired"), { ssr: false })
const Welcome = dynamic(() => import("~/screens/Welcome"), { ssr: false })
type PostSWRKey = {
    data: unknown
    url: string
}
const postJSON = async (key: PostSWRKey) => {
    await axios.post(key.url, key.data)
    return true
}
const Home: FC = () => {
    const authorized = useAuthorized()
    const [, setAuthToken] = useContext(AuthContext) ?? []
    const expired = useExpired()
    const [ttl, setTTL] = useState(DAY)
    const [email, setEmail] = useState<EmailAddress | null>(null)
    const handleSubmit = useCallback(
        (newEmail: EmailAddress | null, newTTL = DAY) => {
            if (isEmailAddress(newEmail)) {
                setTTL(newTTL)
                setEmail(newEmail)
            } else {
                setEmail(null)
                setAuthToken?.(null)
                localStorage.removeItem("auth")
            }
        },
        [setAuthToken],
    )
    const authorizeKey = useMemo<PostSWRKey | null>(
        () => (email ? { url: `/api/authorize/${encodeURIComponent(email)}`, data: { ttl } } : null),
        [email, ttl],
    )
    const authorizeSWR = useSWR(authorizeKey, postJSON)
    const contributorUUID = useContributorUUID()
    const contributorSWR = useContributorSWR(contributorUUID)
    const handleContributorSubmit = useContributorMutator(contributorUUID, contributorSWR)
    useEffect(() => {
        if (authorizeSWR.error || contributorSWR.error) {
            alert(authorizeSWR.error || contributorSWR.error)
        }
    }, [authorizeSWR.error, contributorSWR.error])
    const router = useRouter()
    useEffect(() => {
        if (authorizeSWR.data) {
            router.push("/checkemail")
        }
    }, [authorizeSWR.data, router])
    if (authorizeSWR.isValidating) {
        return <LoadingState>Sending email…</LoadingState>
    }
    if (!contributorSWR.data && contributorSWR.isValidating) {
        return <LoadingState>Checking account…</LoadingState>
    }
    if (!authorized) {
        return <SignIn onSubmit={handleSubmit} />
    }
    if (expired) {
        return <AuthExpired onSubmit={handleSubmit} />
    }
    if (!contributorSWR.data) {
        return <AccountDetails emailAddress={email} uuid={contributorUUID} onSubmit={handleContributorSubmit} />
    }
    return <Welcome />
}
export default Home

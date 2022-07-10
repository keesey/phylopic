import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import axios from "axios"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import AuthContext from "~/auth/AuthContext"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useExpired from "~/auth/hooks/useExpired"
import PageLayout from "~/pages/PageLayout"
import { DAY } from "~/ui/TTLSelector/TTL_VALUES"
const LoadingState = dynamic(() => import("~/screens/LoadingState"), { ssr: false })
const SignIn = dynamic(() => import("~/screens/SignIn"), { ssr: false })
const AuthExpired = dynamic(() => import("~/screens/AuthExpired"), { ssr: false })
const Welcome = dynamic(() => import("~/screens/Welcome"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            description: "Upload your own images to PhyloPic, the open database of freely reusable silhouettes.",
            index: true,
            title: "PhyloPic: Contribute",
            url: "https://contribute.phylopic.org/",
        }}
    >
        <Content />
    </PageLayout>
)
type PostSWRKey = {
    data: unknown
    url: string
}
const postJSON = async (key: PostSWRKey) => {
    await axios.post(key.url, key.data)
    return true
}
const Content: FC = () => {
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
    const swrKey = useMemo<PostSWRKey | null>(
        () => (email ? { url: `/api/authorize/${encodeURIComponent(email)}`, data: { ttl } } : null),
        [email, ttl],
    )
    const { data, error, isValidating } = useSWR(swrKey, postJSON)
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    const router = useRouter()
    useEffect(() => {
        if (data) {
            router.push("/checkemail")
        }
    }, [data, router])
    if (isValidating) {
        return <LoadingState>Sending email&hellip;</LoadingState>
    }
    if (expired) {
        return <AuthExpired onSubmit={handleSubmit} />
    }
    if (!authorized) {
        return <SignIn onSubmit={handleSubmit} />
    }
    return <Welcome />
}
export default Page

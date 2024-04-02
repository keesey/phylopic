import { type JWT } from "@phylopic/source-models"
import {
    type EmailAddress,
    isEmailAddress,
    isUUID,
    isUUIDv4,
    type UUID,
    ValidationFaultCollector,
} from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { type FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import AuthContext from "~/auth/AuthContext"
import fetchJWT from "~/fetchers/fetchJWT"
import PageLayout from "~/pages/PageLayout"
import ErrorState from "~/screens/ErrorState"
import LoadingState from "~/screens/LoadingState"
export interface Props {
    email: EmailAddress
    jti: UUID
}
const Page: NextPage<Props> = ({ email, jti }) => (
    <PageLayout
        seo={{
            noindex: true,
            title: "PhyloPic: Authorization",
        }}
    >
        <Content email={email} jti={jti} />
    </PageLayout>
)
export default Page
const Content: FC<Props> = ({ email, jti }) => {
    const [, setToken] = useContext(AuthContext) ?? []
    const url = useMemo(
        () =>
            isEmailAddress(email) && isUUID(jti)
                ? `/api/authorize/${encodeURIComponent(email)}/${encodeURIComponent(jti)}`
                : null,
        [email, jti],
    )
    const { data, isValidating, error } = useSWRImmutable<JWT>(url, fetchJWT)
    const router = useRouter()
    useEffect(() => {
        if (data) {
            setToken?.(data)
            router.push("/")
        }
    }, [data, router, setToken])
    if (error) {
        return (
            <ErrorState>
                <p>Please check the link in your email.</p>
                <p>If the link expired, you will need to request another.</p>
            </ErrorState>
        )
    }
    if (isValidating) {
        return <LoadingState>Verifying…</LoadingState>
    }
    return <LoadingState>Authorizing…</LoadingState>
}
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const { email, jti } = context.params ?? {}
    const faultCollector = new ValidationFaultCollector()
    if (!isEmailAddress(email, faultCollector.sub("email")) || !isUUIDv4(jti, faultCollector.sub("jti"))) {
        console.warn(faultCollector.list())
        return { notFound: true }
    }
    return {
        props: { email, jti } as Props,
    }
}

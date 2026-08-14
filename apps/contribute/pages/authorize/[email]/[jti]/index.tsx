import { type JWT } from "@phylopic/source-models"
import {
    type EmailAddress,
    isEmailAddress,
    isUUID,
    isUUIDv4,
    type UUID,
    ValidationFaultCollector,
} from "@phylopic/utils"
import axios from "axios"
import type { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { type FC, type ReactNode, useContext, useEffect, useMemo } from "react"
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
const getAuthorizeErrorContent = (error: unknown): ReactNode => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined
    switch (status) {
        case 404:
            return (
                <>
                    <p>This authorization link is invalid or has already been used.</p>
                    <p>
                        Please check the link in your email, or{" "}
                        <Link href="/">request another authorization email</Link>.
                    </p>
                </>
            )
        case 410:
            return (
                <>
                    <p>This authorization link has expired.</p>
                    <p>Please <Link href="/">request another authorization email</Link>.</p>
                </>
            )
        case 500:
            return (
                <>
                    <p>An unexpected error occurred.</p>
                    <p>Please try again later.</p>
                </>
            )
        default:
            return (
                <>
                    <p>Please check the link in your email.</p>
                    <p>
                        If the link expired, you will need to <Link href="/">request another</Link>.
                    </p>
                </>
            )
    }
}
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
        return <ErrorState>{getAuthorizeErrorContent(error)}</ErrorState>
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

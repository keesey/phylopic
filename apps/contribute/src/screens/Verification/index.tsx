import { Loader } from "@phylopic/ui"
import { EmailAddress, isEmailAddress, isUUID, UUID } from "@phylopic/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import AuthContext from "~/auth/AuthContext"
import { JWT } from "~/auth/models/JWT"
import fetchJWT from "~/swr/fetchJWT"
export interface Props {
    email: EmailAddress
    jti: UUID
}
const Verification: FC<Props> = ({ email, jti }) => {
    const [, setJWT] = useContext(AuthContext) ?? []
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
            setJWT?.(data)
            router.push("/")
        }
    }, [data, setJWT])
    if (error) {
        return (
            <section>
                <p>There was an error. Please check the link in your email. Details:</p>
                <blockquote>{String(error)}</blockquote>
                <p>
                    If the link expired, you will need to{" "}
                    <Link href="/">
                        <a>request another</a>
                    </Link>
                    .
                </p>
            </section>
        )
    }
    if (isValidating) {
        return (
            <section>
                <p>Verifying&hellip;</p>
                <Loader />
            </section>
        )
    }
    return null
}
export default Verification

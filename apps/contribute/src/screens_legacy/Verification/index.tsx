import { Loader } from "@phylopic/ui"
import { EmailAddress, isEmailAddress, isUUID, UUID } from "@phylopic/utils"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import AuthContext from "~/auth/AuthContext"
import { JWT } from "~/auth/models/JWT"
import fetchJWT from "~/swr/fetchJWT"
import WelcomeBack from "../WelcomeBack"
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
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    useEffect(() => {
        if (data) {
            setJWT?.(data)
        }
    }, [data, setJWT])
    if (error) {
        return (
            <section>
                <p>There was an error. Please check the link in your email.</p>
                <p>If it expired, you will need to request another.</p>
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
    return <WelcomeBack />
}
export default Verification

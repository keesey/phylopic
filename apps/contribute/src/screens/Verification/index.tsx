import { EmailAddress, UUID } from "@phylopic/utils"
import { FC, useContext, useEffect, useMemo } from "react"
import useSWR from "swr"
import AuthContext from "~/auth/AuthContext"
import { JWT } from "~/auth/JWT"
import fetcher from "~/swr/fetcher"
import Loader from "~/ui/Loader"
import WelcomeBack from "../WelcomeBack"
export interface Props {
    email: EmailAddress
    uuid: UUID
}
const Verification: FC<Props> = ({ email, uuid }) => {
    const [, setJWT] = useContext(AuthContext) ?? []
    const url = useMemo(() => `/api/authorize/${encodeURIComponent(email)}/${encodeURIComponent(uuid)}`, [email, uuid])
    const { data, isValidating, error } = useSWR<JWT>(url, fetcher)
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    useEffect(() => {
        if (data && typeof data === "string") {
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

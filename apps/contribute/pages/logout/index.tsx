/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import { FC, useContext, useEffect } from "react"
import AuthContext from "~/auth/AuthContext"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/ErrorState"
import Farewell from "~/screens/Farewell"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Signed Out",
            url: "https://contribute.phylopic.org/logout",
        }}
    >
        <Content />
    </PageLayout>
)
export default Page
const Content: FC = () => {
    const [token, setToken] = useContext(AuthContext) ?? []
    useEffect(() => {
        setToken?.(null)
        localStorage.removeItem("auth")
    }, [setToken])
    if (token) {
        return <LoadingState>Logging out&hellip;</LoadingState>
    }
    return <Farewell />
}

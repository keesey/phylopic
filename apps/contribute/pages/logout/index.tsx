/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { FC, useCallback, useContext } from "react"
import AuthContext from "~/auth/AuthContext"
import PageLayout from "~/pages/PageLayout"
const ConfirmLogout = dynamic(() => import("~/screens/ConfirmLogout"), { ssr: false })
const Farewell = dynamic(() => import("~/screens/Farewell"), { ssr: false })
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
    const handleLogoutConfirm = useCallback(() => {
        setToken?.(null)
        localStorage.removeItem("auth")
    }, [setToken])
    if (token) {
        return <ConfirmLogout onConfirm={handleLogoutConfirm} />
    }
    return <Farewell />
}

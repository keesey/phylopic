/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { FC } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
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
    const token = useAuthToken()
    if (token) {
        return <ConfirmLogout />
    }
    return <Farewell />
}

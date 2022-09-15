/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import PageLayout from "~/pages/PageLayout"
const ConfirmLogout = dynamic(() => import("~/screens/ConfirmLogout"), { ssr: false })
const Farewell = dynamic(() => import("~/screens/Farewell"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Sign Out",
            url: `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/logout`,
        }}
    >
        <Content />
    </PageLayout>
)
export default Page
const Content: FC = () => {
    const authorized = useAuthorized()
    if (authorized) {
        return <ConfirmLogout />
    }
    return <Farewell />
}

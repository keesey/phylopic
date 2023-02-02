import { Loader } from "@phylopic/ui"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import PageLayout from "~/pages/PageLayout"
const Home = dynamic(() => import("~/pages/Home"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            description: "Upload your own images to PhyloPic, the open database of freely reusable silhouettes.",
            index: true,
            title: "PhyloPic: Contribute",
            url: process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/",
        }}
    >
        <Suspense fallback={<Loader />}>
            <Home />
        </Suspense>
    </PageLayout>
)
export default Page
